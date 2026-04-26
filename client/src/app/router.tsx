import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import PublicOnlyRoute from "../components/routes/PublicOnlyRoute";
import AlertsPage from "../pages/AlertsPage";
import DashboardPage from "../pages/DashboardPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LoginPage from "../pages/LoginPage";
import NotificationsPage from "../pages/NotificationsPage";
import ProfilePage from "../pages/ProfilePage";
import RegisterPage from "../pages/RegisterPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import WatchlistPage from "../pages/WatchlistPage";

/* Define the main application routes with a shared layout */
export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "login",
                element: (
                    <PublicOnlyRoute>
                        <LoginPage />
                    </PublicOnlyRoute>
                ),
            },
            {
                path: "register",
                element: (
                    <PublicOnlyRoute>
                        <RegisterPage />
                    </PublicOnlyRoute>
                ),
            },
            {
                path: "verify-email",
                element: <VerifyEmailPage />,
            },
            {
                path: "forgot-password",
                element: (
                    <PublicOnlyRoute>
                        <ForgotPasswordPage />
                    </PublicOnlyRoute>
                ),
            },
            {
                path: "reset-password",
                element: (
                    <PublicOnlyRoute>
                        <ResetPasswordPage />
                    </PublicOnlyRoute>
                ),
            },
            {
                path: "watchlist",
                element: (
                    <ProtectedRoute>
                        <WatchlistPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "alerts",
                element: (
                    <ProtectedRoute>
                        <AlertsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "notifications",
                element: (
                    <ProtectedRoute>
                        <NotificationsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);