import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export const useTheme = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const colors = isDark
    ? {
        background:
          "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]",
        text: "text-[#E5E7EB]",
        primary: "text-[#60A5FA]", // Silver color (blue-ish)
        secondary: "text-[#93C5FD]", // Silver lighter shade
        platinumPrimary: "text-[#A78BFA]", // Platinum primary (purple-ish)
        platinumSecondary: "text-[#C4B5FD]", // Platinum secondary lighter shade
      }
    : {
        background: "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50",
        text: "text-[#1F2937]",
        primary: "text-[#3B82F6]", // Silver color (blue-ish)
        secondary: "text-[#60A5FA]", // Silver lighter shade
        platinumPrimary: "text-[#8B5CF6]", // Platinum primary (purple-ish)
        platinumSecondary: "text-[#C4B5FD]", // Platinum secondary lighter shade
      };

  return { isDark, toggleTheme, colors };
};
