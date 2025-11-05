import { getStoreMethods } from "./store";
import { im, parseStackTrace } from "./utils";
import { MenuName } from "./constant";

export let wsClient: WebSocket | null = null;

export default async function connectWS() {
  const { port } = await fetch("/api/init-ws", {
    method: "POST",
  })
    .then((v) => {
      return v.json();
    })
    .then((v) => {
      if (v.code !== 0) {
        throw new Error("init-ws failed");
      }
      return v.data;
    });
  wsClient = new WebSocket(`ws://localhost:${port}/devtools`);
  const {
    setInitialValues,
    setChangeLogs,
    setCurrentValues,
    setStoreMeta,
    setTrackUsage,
    setAllChangeLogs,
    getAllChangeLogsRecording,
  } = getStoreMethods();
  wsClient.addEventListener("message", (evt) => {
    console.log("receive message", evt.data);
    const { action, payload } = JSON.parse(evt.data);
    if (action === "createStore") {
      setInitialValues(
        im((vals) => {
          vals[payload.storeName] = payload.initValue;
        })
      );
      setCurrentValues(
        im((vals) => {
          vals[payload.storeName] = payload.snapshot ?? payload.initValue;
        })
      );
      setStoreMeta(
        im((vals) => {
          const { filePath } = parseStackTrace(payload.stack, "store");
          vals[payload.storeName] = {
            source: filePath,
            activeMenu: MenuName.storeValue,
          };
        })
      );
      setChangeLogs(
        im((logs) => {
          logs[payload.storeName] = { list: [], recording: false };
        })
      );
    } else if (action === "changeStore") {
      setChangeLogs(
        im((changes) => {
          if (changes[payload.storeName].recording) {
            // const { filePath, functionName } = parseStackTrace(
            //   payload.stack,
            //   "mutation"
            // );
            changes[payload.storeName].list.push(payload);
          }
        })
      );
      setAllChangeLogs(
        im((logs) => {
          if (getAllChangeLogsRecording()) {
            logs.push(payload);
          }
        })
      );
      setCurrentValues(
        im((vals) => {
          const { key, value } = payload.changeInfo;
          vals[payload.storeName][key] = value;
        })
      );
    } else if (action === "trackPropertyUsage") {
      setTrackUsage(
        im((usage) => {
          usage[payload.storeName] ??= {};
          const deps = (usage[payload.storeName][payload.keyName] ??= []);
          const { filePath, functionName } = parseStackTrace(
            payload.stack,
            "property"
          );
          if (
            filePath &&
            !deps.find(
              (v) => v.filePath === filePath && v.functionName === functionName
            )
          ) {
            deps.push({
              filePath,
              functionName,
            });
          }
        })
      );
    }
  });
}

connectWS();
