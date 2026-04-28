import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsProvider";
import { ThemeProvider } from "./context/ThemeProvider.tsx";

/* Wrap the app with global providers and the main router */
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <NotificationsProvider>
                    <RouterProvider router={router} />
                </NotificationsProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;