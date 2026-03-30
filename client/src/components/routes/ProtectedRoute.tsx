import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type ProtectedRouteProps = {
    children: React.ReactNode;
};

/* Allow access only to authenticated users */
function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();

    /* Redirect guests to the login page */
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    /* Render the protected page for authenticated users */
    return <>{children}</>;
}

export default ProtectedRoute;