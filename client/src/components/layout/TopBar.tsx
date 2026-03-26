import { Menu, Moon, Sun, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

type TopBarProps = {
    onMenuToggle: () => void;
};

/* Display the top application bar */
function TopBar({ onMenuToggle }: TopBarProps) {
    const { isAuthenticated, user } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const displayName = isAuthenticated
        ? user?.firstName || user?.email || "User"
        : "Guest";

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button
                    type="button"
                    className="icon-button topbar-menu-button"
                    onClick={onMenuToggle}
                    aria-label="Open navigation menu"
                >
                    <Menu size={20} />
                </button>

                <div className="brand-block">
                    <span className="brand-title">StockWatch</span>
                    <span className="brand-subtitle">Track smarter</span>
                </div>
            </div>

            <div className="topbar-right">
                <button
                    type="button"
                    className="icon-button topbar-theme-button"
                    onClick={toggleTheme}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    title={isDark ? "Light mode" : "Dark mode"}
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <div className="user-chip" title={displayName}>
                    <span className="user-chip-icon">
                        <User size={16} />
                    </span>

                    <span className="user-chip-text">{displayName}</span>
                </div>
            </div>
        </header>
    );
}

export default TopBar;