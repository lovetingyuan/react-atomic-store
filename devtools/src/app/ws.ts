import { getStoreMethods } from "./store";
import ErrorStackParser from "error-stack-parser";
import { im } from "./utils";
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
  } = getStoreMethods();
  wsClient.addEventListener("message", (evt) => {
    console.log("receive message", evt.data);
    const { action, payload } = JSON.parse(evt.data);
    if (action === "createStore") {
      setInitialValues(
        im((vals) => {
          vals[payload.storeName] = payload.initValue;
        }),
      );
      setCurrentValues(
        im((vals) => {
          vals[payload.storeName] = payload.initValue;
        }),
      );
      setStoreMeta(
        im((vals) => {
          const err = new Error();
          err.stack = payload.stack;
          const parsed = ErrorStackParser.parse(err);
          let source = "";
          if (parsed[1]?.fileName) {
            const path = new URL(parsed[1].fileName).pathname;
            source = path; // `${path}:${parsed[1].lineNumber}:${parsed[1].columnNumber}`;
          }
          vals[payload.storeName] = {
            source,
            activeMenu: MenuName.currentStoreValue,
          };
        }),
      );
    } else if (action === "changeStore") {
      setChangeLogs(
        im((changes) => {
          changes[payload.storeName] ??= [];
          changes[payload.storeName].push(payload.changeInfo);
        }),
      );
      setCurrentValues(
        im((vals) => {
          const { key, value } = payload.changeInfo;
          vals[payload.storeName][key] = value;
        }),
      );
    } else if (action === "trackPropertyUsage") {
      setTrackUsage(
        im((usage) => {
          usage[payload.storeName] ??= {};
          const deps = (usage[payload.storeName][payload.keyName] ??= []);
          const err = new Error();
          err.stack = payload.component;
          const [{ fileName }] = ErrorStackParser.parse(err);
          if (fileName) {
            const { pathname } = new URL(fileName);
            if (pathname && !deps.includes(pathname)) {
              deps.push(pathname);
            }
          }
        }),
      );
    }
  });
}

connectWS();
