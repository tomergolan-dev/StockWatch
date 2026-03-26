import {
    X,
    LayoutDashboard,
    Bell,
    ChartNoAxesCombined,
    LogOut,
    LogIn,
    UserPlus,
} from "lucide-react";
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

            <aside
                className={`side-drawer ${isOpen ? "open" : ""}`}
                aria-hidden={!isOpen}
            >
                <div className="side-drawer-header">
                    <h2 className="drawer-title">Menu</h2>

                    <button
                        type="button"
                        className="icon-button drawer-close-button"
                        onClick={onClose}
                        aria-label="Close navigation menu"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="side-drawer-nav">
                    <Link to="/" onClick={onClose}>
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </Link>

                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" onClick={onClose}>
                                <LogIn size={18} />
                                <span>Sign In</span>
                            </Link>

                            <Link to="/register" onClick={onClose}>
                                <UserPlus size={18} />
                                <span>Sign Up</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/" onClick={onClose}>
                                <ChartNoAxesCombined size={18} />
                                <span>Watchlist</span>
                            </Link>

                            <Link to="/" onClick={onClose}>
                                <Bell size={18} />
                                <span>Alerts</span>
                            </Link>

                            <Link to="/" onClick={onClose}>
                                <Bell size={18} />
                                <span>Notifications</span>
                            </Link>

                            <button
                                type="button"
                                className="drawer-logout-button"
                                onClick={() => {
                                    logout();
                                    onClose();
                                }}
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </>
                    )}
                </nav>
            </aside>
        </>
    );
}

export default SideDrawer;