import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nodeAdapter from "@hono/vite-dev-server/node";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import buildHono from "@hono/vite-build/node";
import tailwindcss from "@tailwindcss/vite";
import { execSync } from "child_process";
import codePositionPlugin from "code-position";
import conventionRoutePlugin from "vite-plugin-convention-route";
import { fileURLToPath } from "url";

process.env.VITE_BUILD_TIME = new Date().toLocaleString();
try {
  // eslint-disable-next-line sonarjs/no-os-command-from-path
  process.env.VITE_GIT_HASH = execSync("git rev-parse --short HEAD", {
    encoding: "utf8",
  }).trim();
} catch {
  console.warn("Can not get Git Hash");
}

const config = defineConfig(({ command, mode }) => {
  console.log("command:", command, "mode:", mode, "env:", process.env.NODE_ENV);
  const port = Number(process.env.PORT) || 3005;
  const isHonoBuild = command === "build" && mode === "hono";
  return {
    server: {
      port,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      copyPublicDir: !isHonoBuild,
      rollupOptions: {
        external: ["ws"],
      },
    },
    css: {
      devSourcemap: true,
    },
    plugins: [
      react({
        babel: {
          plugins: [
            process.env.NODE_ENV === "development" ? codePositionPlugin : null,
            ["babel-plugin-react-compiler"],
          ].filter((v) => !!v),
        },
      }),
      conventionRoutePlugin(),
      tailwindcss(),
      devServer({
        adapter: nodeAdapter,
        injectClientScript: false,
        exclude: ["!/api/**", ...defaultOptions.exclude],
        entry: "./src/server/index.ts",
        handleHotUpdate(ctx) {
          return ctx.modules; // avoid default full reload
        },
      }),
      isHonoBuild &&
        buildHono({
          entry: "./src/server/index.ts",
          output: "server.js",
          minify: false,
          emptyOutDir: false,
          port,
        }),
    ],
  };
});

export default config;
