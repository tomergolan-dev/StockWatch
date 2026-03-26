import {
    createContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
    theme: ThemeMode;
    isDark: boolean;
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);

type ThemeProviderProps = {
    children: ReactNode;
};

const THEME_KEY = "themeMode";

/* Store and control the application theme */
export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<ThemeMode>("dark");

    /* Restore the saved theme on app startup */
    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null;

        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme);
            return;
        }

        localStorage.setItem(THEME_KEY, "dark");
    }, []);

    /* Apply the active theme to the document root */
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    /* Switch between light and dark modes */
    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "dark" ? "light" : "dark"
        );
    };

    const value = useMemo<ThemeContextType>(
        () => ({
            theme,
            isDark: theme === "dark",
            toggleTheme,
        }),
        [theme]
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}