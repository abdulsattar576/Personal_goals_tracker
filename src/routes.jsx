import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Protected from "./components/Protected";
export const router=createBrowserRouter([
     {
        path:"/",
        element: <Protected><Dashboard/></Protected>
     },
     {
      path:"/signup",
      element:<Signup/>
     },
     {
      path:"/login",
      element:<Login/>
     },
      
])