 import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";
 
 import{GoalProvider} from "../src/components/context"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoalProvider>
      <RouterProvider router={router} />
      <App />
    </GoalProvider>
  </StrictMode>
);