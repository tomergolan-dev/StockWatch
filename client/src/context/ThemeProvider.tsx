import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { ThemeContext, type ThemeMode } from "./ThemeContext";
import { getFallbackIsDark, shouldUseDarkBySun } from "../utils/sunTime";

type ThemeProviderProps = {
    children: ReactNode;
};

type Coordinates = {
    latitude: number;
    longitude: number;
};

const THEME_MODE_KEY = "themeMode";

function getStoredThemeMode(): ThemeMode {
    const stored = localStorage.getItem(THEME_MODE_KEY);

    if (stored === "auto" || stored === "light" || stored === "dark") {
        return stored;
    }

    return "auto";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [themeMode, setThemeModeState] = useState<ThemeMode>(
        getStoredThemeMode()
    );

    const [autoIsDark, setAutoIsDark] = useState<boolean>(
        getFallbackIsDark()
    );

    const [coords, setCoords] = useState<Coordinates | null>(null);

    const isDark =
        themeMode === "dark" || (themeMode === "auto" && autoIsDark);

    const setThemeMode = useCallback((mode: ThemeMode) => {
        localStorage.setItem(THEME_MODE_KEY, mode);
        setThemeModeState(mode);
    }, []);

    const setAutoTheme = useCallback(() => {
        setThemeMode("auto");
    }, [setThemeMode]);

    const toggleTheme = useCallback(() => {
        setThemeMode(isDark ? "light" : "dark");
    }, [isDark, setThemeMode]);

    const updateAutoTheme = useCallback(
        (position: Coordinates | null) => {
            if (!position) {
                setAutoIsDark(getFallbackIsDark());
                return;
            }

            setAutoIsDark(
                shouldUseDarkBySun(position.latitude, position.longitude)
            );
        },
        []
    );

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            isDark ? "dark" : "light"
        );
    }, [isDark]);

    useEffect(() => {
        if (themeMode !== "auto") return;

        if (!navigator.geolocation) {
            const timeoutId = window.setTimeout(() => {
                updateAutoTheme(null);
            }, 0);

            return () => window.clearTimeout(timeoutId);
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newCoords = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                };

                setCoords(newCoords);
                updateAutoTheme(newCoords);
            },
            () => {
                window.setTimeout(() => {
                    updateAutoTheme(null);
                }, 0);
            }
        );
    }, [themeMode, updateAutoTheme]);

    useEffect(() => {
        if (themeMode !== "auto") return;

        const interval = setInterval(() => {
            updateAutoTheme(coords);
        }, 60000);

        return () => clearInterval(interval);
    }, [themeMode, coords, updateAutoTheme]);

    const value = useMemo(
        () => ({
            themeMode,
            isDark,
            toggleTheme,
            setThemeMode,
            setAutoTheme,
        }),
        [themeMode, isDark, toggleTheme, setThemeMode, setAutoTheme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}