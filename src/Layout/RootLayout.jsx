import React from "react";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../Pages/Shared/Footer/Footer";
import { useTheme } from "../Hooks/useTheme";

const RootLayout = () => {
  const { colors } = useTheme();

  return (
    <div>
      <header>
        <Navbar></Navbar>
      </header>
      <main className={`min-h-[calc(100vh-150px)] px-[3%] lg:px-[10%] py-8 ${colors.background}`}>
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default RootLayout;
