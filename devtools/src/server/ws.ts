import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import { type WSContext } from "hono/ws";
import { type WebSocket } from "ws";

const wsApp = new Hono();

const PORT = 3006;

let devtoolsWebsocket: WSContext<WebSocket> | null = null;

// const clientWebsockets = new Set<WSContext<WebSocket>>();
let userAppWebsocket: WSContext<WebSocket> | null = null;

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({
  app: wsApp,
});

wsApp.get(
  "/user_app",
  upgradeWebSocket(() => {
    return {
      onOpen(_, ws) {
        if (userAppWebsocket) {
          userAppWebsocket.close();
        }
        userAppWebsocket = ws;
      },
      onMessage: (event, ws) => {
        // only handle the latest user app ws
        if (userAppWebsocket !== ws) {
          return;
        }
        console.log(`Message from client: ${event.data}`, ws.url);
        const id = ws.url?.searchParams.get("id");
        if (!id) {
          return;
        }
        const { action, payload } = JSON.parse(event.data);
        if (
          action === "createStore" ||
          action === "changeStore" ||
          action === "trackPropertyUsage"
        ) {
          devtoolsWebsocket?.send(
            JSON.stringify({
              source: "server",
              action,
              payload,
            })
          );
        }
      },
      onClose: () => {
        userAppWebsocket = null;
        console.log("Connection closed");
      },
    };
  })
);

wsApp.get(
  "/devtools",
  upgradeWebSocket(() => {
    return {
      onOpen(_, ws) {
        if (devtoolsWebsocket) {
          devtoolsWebsocket.close();
        }
        devtoolsWebsocket = ws;
      },
      onMessage: (event) => {
        console.log(`Message from client: ${event.data}`);
        const { action, payload } = JSON.parse(event.data);
        if (action === "reload-app") {
          userAppWebsocket?.send(
            JSON.stringify({
              source: "server",
              action: "reload-app",
              payload,
            })
          );
        } else if (action === "change-store-property") {
          userAppWebsocket?.send(
            JSON.stringify({
              source: "server",
              action: "change-store-property",
              payload,
            })
          );
        } else if (action === "reset-store-property") {
          userAppWebsocket?.send(
            JSON.stringify({
              source: "server",
              action: "reset-store-property",
              payload,
            })
          );
        }
      },
      onClose: () => {
        console.log("Connection closed");
      },
    };
  })
);

const server = serve({
  fetch: wsApp.fetch,
  port: PORT,
});

injectWebSocket(server);

// if (import.meta.hot) {
//   import.meta.hot.accept(() => {
//     console.log('🔄 热更新：模块已接受更新');
//   });
//   import.meta.hot.dispose(() => {
//     console.log('🔄 热更新：正在关闭旧的服务器实例...');
//     server.close(() => {
//       console.log('✅ 旧服务器实例已关闭');
//     });
//   });
// }

export { PORT };
