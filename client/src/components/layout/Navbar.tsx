import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/* Display the main navigation across the site */
function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="navbar">
            <div className="navbar-left">
                <Link to="/">StockWatch</Link>
                <Link to="/">Dashboard</Link>
            </div>

            <div className="navbar-right">
                {!isAuthenticated ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
            <span>
              Hello, {user?.firstName || user?.email}
            </span>
                        <button type="button" onClick={logout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Navbar;