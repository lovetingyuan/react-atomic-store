async function main() {
  const clientId = crypto.randomUUID();
  const wsUri = "ws://localhost:3006/user_app?id=" + clientId;
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
      location.reload();
    } else if (action === "change-store-property") {
      const { storeName, keyName, value } = payload;
      const key = `${keyName[0].toUpperCase()}${keyName.slice(1)}`;
      __REACT_ATOMIC_STORE_DEV_TOOLS__.methods[storeName][`set${key}`](value);
    } else if (action === "reset-store-property") {
      const { storeName, keyName } = payload;
      const key = `${keyName[0].toUpperCase()}${keyName.slice(1)}`;
      const initVal =
        __REACT_ATOMIC_STORE_DEV_TOOLS__.initialValues[storeName][keyName];
      __REACT_ATOMIC_STORE_DEV_TOOLS__.methods[storeName][`set${key}`](initVal);
    }
  });

  websocket.addEventListener("error", (e) => {
    console.log(`ERROR: ${e.data}`);
    connected = false;
  });

  window.__REACT_ATOMIC_STORE_DEV_TOOLS__ = {
    enabled: true,
    methods: {},
    initialValues: {},
    send(action, payload) {
      if (!connected) {
        messagesQueue.push({ source, action, payload });
      } else {
        websocket.send(
          JSON.stringify({
            action,
            payload,
            source,
          }),
        );
        // console.log("send", { action, payload });
      }
    },
  };
}
main();
