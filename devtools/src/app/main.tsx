import "./ws";
import { RouterProvider } from "react-router";
import ReactDOM from "react-dom/client";

import { router } from "./lib/route";

const root = document.getElementById("root");

const app = ReactDOM.createRoot(root!);
app.render(<RouterProvider router={router} />);
