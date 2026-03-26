import { createContext } from "react";
import type { AuthUser } from "../types/auth.types";

export type LoginPayload = {
    token: string;
    user: AuthUser;
};

export type AuthContextType = {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (payload: LoginPayload) => void;
    logout: () => void;
    setUser: (user: AuthUser | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);