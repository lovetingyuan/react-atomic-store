async function main() {
  const clientId = crypto.randomUUID();
  // console.log(9999, import.meta.url);
  const baseUrl = new URL(document.currentScript.src);
  const { code, data } = await fetch(baseUrl.origin + "/api/init-ws", {
    method: "POST",
  }).then((r) => r.json());
  if (code !== 0) {
    alert("Failed to connect to react-atomic-store devtools server");
    return;
  }
  const wsUri = `ws://localhost:${data.port}/user_app?id=${clientId}`;
  const source = "devapps"; // + clientId;

  const websocket = new WebSocket(wsUri);
  const messagesQueue = [];
  let connected = false;

  websocket.addEventListener("open", () => {
    console.log("CONNECTED");
    connected = true;
    for (const msg of messagesQueue) {
      websocket.send(JSON.stringify(msg));
      console.log("send", msg);
    }
    messagesQueue.length = 0;
  });

  websocket.addEventListener("close", () => {
    console.log("DISCONNECTED");
    connected = false;
  });

  websocket.addEventListener("message", (e) => {
    const { action, payload } = JSON.parse(e.data);
    if (action === "reload-app") {
      // location.reload();
      for (const storeName in devtools.stores) {
        const { initValue, stack, snapshot } = devtools.stores[storeName];
        websocket.send(
          JSON.stringify({
            action: "createStore",
            payload: {
              storeName,
              initValue,
              stack,
              snapshot,
            },
            source: "userApp",
          })
        );
      }
    } else if (action === "change-store-property") {
      const { storeName, keyName, value } = payload;
      const key = `${keyName[0].toUpperCase()}${keyName.slice(1)}`;
      const { methods } = devtools.stores[storeName];
      methods[`set${key}`](value);
    } else if (action === "reset-store-property") {
      const { storeName, keyName } = payload;
      const key = `${keyName[0].toUpperCase()}${keyName.slice(1)}`;
      const { initValue, methods } = devtools.stores[storeName];
      methods[`set${key}`](initValue[keyName]);
    }
  });

  websocket.addEventListener("error", (e) => {
    console.log(`ERROR: ${e.data}`);
    connected = false;
  });

  const devtools = (window.__REACT_ATOMIC_STORE_DEV_TOOLS__ = {
    enabled: true,
    stores: {},
    send(action, payload) {
      if (!connected) {
        messagesQueue.push({ source, action, payload });
      } else {
        websocket.send(
          JSON.stringify({
            action,
            payload,
            source,
          })
        );
        // console.log("send", { action, payload });
      }
    },
  });
}

main();
