import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export const useTheme = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const colors = isDark
    ? {
        background:
          "bg-gradient-to-br from-[#1F2937] via-[#374151] to-[#4B5563]",
        text: "text-[#E5E7EB]",
        primary: "text-[#60A5FA]",
        secondary: "text-[#93C5FD]",
      }
    : {
        background:
          "bg-gradient-to-br from-[#F9FAFB] via-[#FFFFFF] to-[#F0F4F8]",
        text: "text-[#1F2937]",
        primary: "text-[#3B82F6]",
        secondary: "text-[#60A5FA]",
      };

  return { isDark, toggleTheme, colors };
};
