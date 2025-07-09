import React from "react";
import { useTheme } from "../../../Hooks/useTheme";

const Home = () => {
  const { colors } = useTheme();

  return (
    <div className={`min-h-screen  ${colors.text}`}>
      <h1 className={`text-3xl font-bold ${colors.primary}`}>This is Home</h1>
      <p className={`mt-4 text-lg ${colors.secondary}`}>
        Welcome to HostelBite! Enjoy your meals with our exclusive features.
      </p>
    </div>
  );
};

export default Home;
