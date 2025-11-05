import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createStore } from "react-atomic-store";
import { FooBar } from "./components/FooBar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <p>React: {React.version}</p>
    <App />
    <FooBar />
  </React.StrictMode>
);

createStore("bar33Store", {
  aa: 1,
  bb: 1,
  cc: 1,
  dd: 1,
  ee: 1,
  ff: 1,
  gg: 1,
  hh: 1,
  mm: 1,
  nn: 1,
  oo: 1,
  pp: 1,
  qq: 1,
  rr: 1,
  ss: 1,
});
