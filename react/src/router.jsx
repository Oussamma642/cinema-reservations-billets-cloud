import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import Signup from "./views/Signup";

const router = createBrowserRouter([
  // DefaultLayout
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/dashboard/",
        element: <Dashboard />,
      },
    ],
  },

  // GuestLayout
  {
    path: "/auth",
    element: <GuestLayout />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/signup",
        element: <Signup />,
      },
    ],
  }
]);

export default router;
