import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

type ThemeMode = "auto" | "light" | "dark";

type ThemeContextValue = {
    themeMode: ThemeMode;
    isDark: boolean;
    toggleTheme: () => void;
    setAutoTheme: () => void;
};

type ThemeProviderProps = {
    children: ReactNode;
};

const THEME_MODE_KEY = "themeMode";

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredThemeMode(): ThemeMode {
    const storedThemeMode = localStorage.getItem(THEME_MODE_KEY);

    if (
        storedThemeMode === "auto" ||
        storedThemeMode === "light" ||
        storedThemeMode === "dark"
    ) {
        return storedThemeMode;
    }

    return "auto";
}

function getFallbackIsDark() {
    const currentHour = new Date().getHours();

    return currentHour < 6 || currentHour >= 19;
}

/* Calculate sunrise or sunset in local hours using latitude and longitude */
function calculateSunTime(
    latitude: number,
    longitude: number,
    isSunrise: boolean
) {
    const date = new Date();
    const dayStart = new Date(date.getFullYear(), 0, 0);
    const dayOfYear = Math.floor(
        (date.getTime() - dayStart.getTime()) / 1000 / 60 / 60 / 24
    );

    const lngHour = longitude / 15;
    const approximateTime = isSunrise
        ? dayOfYear + (6 - lngHour) / 24
        : dayOfYear + (18 - lngHour) / 24;

    const meanAnomaly = 0.9856 * approximateTime - 3.289;

    let trueLongitude =
        meanAnomaly +
        1.916 * Math.sin((Math.PI / 180) * meanAnomaly) +
        0.02 * Math.sin((Math.PI / 180) * 2 * meanAnomaly) +
        282.634;

    trueLongitude = (trueLongitude + 360) % 360;

    let rightAscension =
        (180 / Math.PI) *
        Math.atan(0.91764 * Math.tan((Math.PI / 180) * trueLongitude));

    rightAscension = (rightAscension + 360) % 360;

    const longitudeQuadrant = Math.floor(trueLongitude / 90) * 90;
    const rightAscensionQuadrant = Math.floor(rightAscension / 90) * 90;

    rightAscension += longitudeQuadrant - rightAscensionQuadrant;
    rightAscension /= 15;

    const sinDeclination =
        0.39782 * Math.sin((Math.PI / 180) * trueLongitude);
    const cosDeclination = Math.cos(Math.asin(sinDeclination));

    const zenith = 90.833;

    const localHourCosine =
        (Math.cos((Math.PI / 180) * zenith) -
            sinDeclination * Math.sin((Math.PI / 180) * latitude)) /
        (cosDeclination * Math.cos((Math.PI / 180) * latitude));

    if (localHourCosine > 1 || localHourCosine < -1) {
        return null;
    }

    const localHour = isSunrise
        ? 360 - (180 / Math.PI) * Math.acos(localHourCosine)
        : (180 / Math.PI) * Math.acos(localHourCosine);

    const localHourInHours = localHour / 15;

    const localMeanTime =
        localHourInHours + rightAscension - 0.06571 * approximateTime - 6.622;

    const utcTime = (localMeanTime - lngHour + 24) % 24;
    const timezoneOffset = -date.getTimezoneOffset() / 60;

    return (utcTime + timezoneOffset + 24) % 24;
}

function shouldUseDarkBySun(latitude: number, longitude: number) {
    const sunrise = calculateSunTime(latitude, longitude, true);
    const sunset = calculateSunTime(latitude, longitude, false);

    if (sunrise === null || sunset === null) {
        return getFallbackIsDark();
    }

    const now = new Date();
    const currentTime = now.getHours() + now.getMinutes() / 60;

    return currentTime < sunrise || currentTime >= sunset;
}

/* Provide global theme state with persisted manual preference and auto mode */
export function ThemeProvider({ children }: ThemeProviderProps) {
    const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
        getStoredThemeMode()
    );
    const [autoIsDark, setAutoIsDark] = useState(() => getFallbackIsDark());

    const isDark =
        themeMode === "dark" || (themeMode === "auto" && autoIsDark);

    const toggleTheme = useCallback(() => {
        setThemeMode((currentMode) => {
            const nextMode = currentMode === "dark" ? "light" : "dark";
            localStorage.setItem(THEME_MODE_KEY, nextMode);

            return nextMode;
        });
    }, []);

    const setAutoTheme = useCallback(() => {
        localStorage.setItem(THEME_MODE_KEY, "auto");
        setThemeMode("auto");
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            isDark ? "dark" : "light"
        );
    }, [isDark]);

    useEffect(() => {
        if (themeMode !== "auto") {
            return;
        }

        const updateByFallbackTime = () => {
            setAutoIsDark(getFallbackIsDark());
        };

        if (!navigator.geolocation) {
            updateByFallbackTime();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setAutoIsDark(
                    shouldUseDarkBySun(
                        position.coords.latitude,
                        position.coords.longitude
                    )
                );
            },
            updateByFallbackTime,
            {
                enableHighAccuracy: false,
                maximumAge: 1000 * 60 * 60,
                timeout: 5000,
            }
        );
    }, [themeMode]);

    const value = useMemo(
        () => ({
            themeMode,
            isDark,
            toggleTheme,
            setAutoTheme,
        }),
        [themeMode, isDark, toggleTheme, setAutoTheme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}