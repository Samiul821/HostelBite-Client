import React from "react";
import { useTheme } from "../Hooks/useTheme";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const AuthLaout = () => {
  const { colors } = useTheme();

  return (
    <div>
      <header>
        <Navbar></Navbar>
      </header>
      <main className={`min-h-[calc(100vh-150px)]  ${colors.background}`}>
        <Outlet></Outlet>
      </main>
    </div>
  );
};

export default AuthLaout;
