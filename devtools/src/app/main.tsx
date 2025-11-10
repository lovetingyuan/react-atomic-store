import "./ws";
import { createBrowserRouter, RouterProvider } from "react-router";
import ReactDOM from "react-dom/client";

// import routes from "./lib/route";
import routes from "virtual:route?routePath=/src/app/pages";

console.log(9999, routes);
const router = createBrowserRouter(routes);

const root = document.getElementById("root");

const app = ReactDOM.createRoot(root!);
app.render(<RouterProvider router={router} />);
