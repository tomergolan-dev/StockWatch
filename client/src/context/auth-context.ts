import { createContext } from "react";
import type { AuthUser } from "../types/auth.types";

export type LoginPayload = {
    token: string;
    user: AuthUser;
};

export type AuthContextValue = {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (payload: LoginPayload) => void;
    logout: () => void;
    setUser: (user: AuthUser | null) => void;
    updateUser: (user: AuthUser) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);