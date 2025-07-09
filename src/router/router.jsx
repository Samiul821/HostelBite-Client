import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLaout from "../Layout/AuthLaout";
import Login from "../Pages/Auth/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLaout,
    children: [
      {
        path: '/login',
        Component: Login
      }
    ]
  }
]);

export default router;
