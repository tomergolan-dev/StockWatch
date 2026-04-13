import { useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, User, Bell } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import NotificationsPanel from "../../features/notifications/NotificationsPanel";
import { useNotifications } from "../../hooks/useNotifications";

type TopBarProps = {
    onMenuToggle: () => void;
};

function TopBar({ onMenuToggle }: TopBarProps) {
    const { isAuthenticated, user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const { unreadCount } = useNotifications();

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const userMenuRef = useRef<HTMLDivElement | null>(null);

    const displayName = user?.firstName || user?.email || "User";

    useEffect(() => {
        if (!isUserMenuOpen) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;

            if (userMenuRef.current && !userMenuRef.current.contains(target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isUserMenuOpen]);

    return (
        <>
            <header className="topbar">
                <div className="topbar-left">
                    <button className="icon-button" onClick={onMenuToggle}>
                        <Menu size={20} />
                    </button>

                    <div className="brand-block">
                        <span className="brand-title">StockWatch</span>
                    </div>
                </div>

                <div className="topbar-right">
                    <button className="icon-button" onClick={toggleTheme}>
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {isAuthenticated && (
                        <button
                            className="icon-button notification-bell"
                            onClick={() => setIsNotificationsOpen(true)}
                        >
                            <Bell size={18} />

                            {unreadCount > 0 && (
                                <span className="notification-badge animate">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>
                    )}

                    {isAuthenticated ? (
                        <div className="user-menu-wrapper" ref={userMenuRef}>
                            <button
                                className="user-chip clickable"
                                onClick={() =>
                                    setIsUserMenuOpen((prev) => !prev)
                                }
                            >
                                <User size={16} />
                                <span>{displayName}</span>
                            </button>

                            {isUserMenuOpen && (
                                <div className="user-dropdown">
                                    <button onClick={() => navigate("/profile")}>
                                        Profile
                                    </button>

                                    <button
                                        className="danger"
                                        onClick={() => logout()}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            className="icon-button"
                            onClick={() => navigate("/login")}
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
        </>
    );
}

export default TopBar;