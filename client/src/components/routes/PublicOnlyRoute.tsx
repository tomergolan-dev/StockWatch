import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type PublicOnlyRouteProps = {
    children: React.ReactNode;
};

/* Block authenticated users from accessing public-only pages */
function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
    const { isAuthenticated } = useAuth();

    /* Redirect authenticated users to the dashboard */
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    /* Allow guests to access the requested page */
    return <>{children}</>;
}

export default PublicOnlyRoute;