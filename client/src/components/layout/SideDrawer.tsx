import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type SideDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

/* Display the slide-out navigation drawer */
function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
    const { isAuthenticated, logout } = useAuth();

    return (
        <>
            <div
                className={`drawer-overlay ${isOpen ? "open" : ""}`}
                onClick={onClose}
                aria-hidden={!isOpen}
            />

            <aside className={`side-drawer ${isOpen ? "open" : ""}`}>
                <div className="side-drawer-header">
                    <h2>Menu</h2>
                    <button
                        type="button"
                        className="icon-button"
                        onClick={onClose}
                        aria-label="Close navigation menu"
                    >
                        ✕
                    </button>
                </div>

                <nav className="side-drawer-nav">
                    <Link to="/" onClick={onClose}>
                        Dashboard
                    </Link>

                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" onClick={onClose}>
                                Login
                            </Link>
                            <Link to="/register" onClick={onClose}>
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/" onClick={onClose}>
                                Watchlist
                            </Link>
                            <Link to="/" onClick={onClose}>
                                Alerts
                            </Link>
                            <Link to="/" onClick={onClose}>
                                Notifications
                            </Link>

                            <button
                                type="button"
                                className="drawer-logout-button"
                                onClick={() => {
                                    logout();
                                    onClose();
                                }}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </aside>
        </>
    );
}

export default SideDrawer;