import { createContext } from "react";

export type ThemeMode = "auto" | "light" | "dark";

export type ThemeContextValue = {
    themeMode: ThemeMode;
    isDark: boolean;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void;
    setAutoTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);