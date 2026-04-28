import { useEffect, useRef, useState } from "react";
import { Bell, Menu, SunMoon, Moon, Sun, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationsPanel from "../../features/notifications/NotificationsPanel";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import { useTheme } from "../../hooks/useTheme";

type TopBarProps = {
    onMenuToggle: () => void;
};

function TopBar({ onMenuToggle }: TopBarProps) {
    const { isAuthenticated, user, logout } = useAuth();
    const { isDark, themeMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const { unreadCount } = useNotifications();

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const userMenuRef = useRef<HTMLDivElement | null>(null);

    const displayName = user?.firstName || user?.email || "User";

    const themeLabel =
        themeMode === "auto"
            ? `Theme: Auto (${isDark ? "Dark" : "Light"})`
            : themeMode === "dark"
                ? "Theme: Dark"
                : "Theme: Light";

    useEffect(() => {
        if (!isUserMenuOpen) {
            return;
        }

        const handleClick = (event: MouseEvent) => {
            const target = event.target as Node;

            if (userMenuRef.current && !userMenuRef.current.contains(target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () => document.removeEventListener("mousedown", handleClick);
    }, [isUserMenuOpen]);

    const handleConfirmLogout = () => {
        logout();
        setShowLogoutConfirm(false);
        setIsUserMenuOpen(false);
    };

    return (
        <>
            <header className="topbar">
                <div className="topbar-left">
                    <button
                        type="button"
                        className="icon-button"
                        onClick={onMenuToggle}
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="brand-block">
                        <span className="brand-title">StockWatch</span>
                    </div>
                </div>

                <div className="topbar-right">
                    <button
                        type="button"
                        className="icon-button"
                        onClick={toggleTheme}
                        title={themeLabel}
                        aria-label={themeLabel}
                    >
                        {themeMode === "auto" ? (
                            <SunMoon size={18} />
                        ) : isDark ? (
                            <Sun size={18} />
                        ) : (
                            <Moon size={18} />
                        )}
                    </button>

                    {isAuthenticated ? (
                        <button
                            type="button"
                            className="icon-button notification-bell"
                            onClick={() => setIsNotificationsOpen(true)}
                            aria-label="Open notifications"
                        >
                            <Bell size={18} />

                            {unreadCount > 0 ? (
                                <span className="notification-badge animate">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            ) : null}
                        </button>
                    ) : null}

                    {isAuthenticated ? (
                        <div className="user-menu-wrapper" ref={userMenuRef}>
                            <button
                                type="button"
                                className="user-chip clickable"
                                onClick={() =>
                                    setIsUserMenuOpen((current) => !current)
                                }
                            >
                                <User size={16} />
                                <span>{displayName}</span>
                            </button>

                            {isUserMenuOpen ? (
                                <div className="user-dropdown">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            navigate("/profile");
                                        }}
                                    >
                                        Profile
                                    </button>

                                    <button
                                        type="button"
                                        className="danger"
                                        onClick={() => setShowLogoutConfirm(true)}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="icon-button"
                            onClick={() => navigate("/login")}
                            aria-label="Go to login"
                        >
                            <User size={18} />
                        </button>
                    )}
                </div>
            </header>

            <NotificationsPanel
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
            />

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

export default TopBar;