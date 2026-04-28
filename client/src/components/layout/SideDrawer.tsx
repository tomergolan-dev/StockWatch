import {
    Bell,
    ChartNoAxesCombined,
    LayoutDashboard,
    LogIn,
    LogOut,
    UserPlus,
    X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type SideDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

/* Display the slide-out navigation drawer */
function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
    const { isAuthenticated, logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleConfirmLogout = () => {
        logout();
        setShowLogoutConfirm(false);
        onClose();
    };

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
                            <Link to="/watchlist" onClick={onClose}>
                                <ChartNoAxesCombined size={18} />
                                <span>Watchlist</span>
                            </Link>

                            <Link to="/alerts" onClick={onClose}>
                                <Bell size={18} />
                                <span>Alerts</span>
                            </Link>

                            <button
                                type="button"
                                className="drawer-logout-button"
                                onClick={() => setShowLogoutConfirm(true)}
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </>
                    )}
                </nav>
            </aside>

            {showLogoutConfirm ? (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Log out?</h3>

                        <p>Are you sure you want to log out?</p>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="auth-secondary-button"
                                onClick={() => setShowLogoutConfirm(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="stock-action-button danger"
                                onClick={handleConfirmLogout}
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default SideDrawer;