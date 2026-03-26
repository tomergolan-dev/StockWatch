import { useMemo, useState, type ReactNode } from "react";
import { AuthContext, type LoginPayload } from "./auth-context";
import type { AuthUser } from "../types/auth.types";

type AuthProviderProps = {
    children: ReactNode;
};

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";

function getStoredAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getStoredUser(): AuthUser | null {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as AuthUser;
    } catch {
        localStorage.removeItem(USER_KEY);
        return null;
    }
}

/* Provide global authentication state and actions */
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
    const [accessToken, setAccessToken] = useState<string | null>(() =>
        getStoredAccessToken()
    );

    /* Save auth data after a successful login */
    const login = ({ token, user }: LoginPayload) => {
        setAccessToken(token);
        setUser(user);

        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    };

    /* Clear auth data on logout */
    const logout = () => {
        setAccessToken(null);
        setUser(null);

        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    };

    const value = useMemo(
        () => ({
            user,
            accessToken,
            isAuthenticated: Boolean(accessToken && user),
            login,
            logout,
            setUser,
        }),
        [user, accessToken]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}