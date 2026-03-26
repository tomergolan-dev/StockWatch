import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

type TopBarProps = {
    onMenuToggle: () => void;
};

/* Display the top application bar */
function TopBar({ onMenuToggle }: TopBarProps) {
    const { isAuthenticated, user } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button
                    type="button"
                    className="icon-button"
                    onClick={onMenuToggle}
                    aria-label="Open navigation menu"
                >
                    SW
                </button>

                <div className="brand-block">
                    <span className="brand-title">StockWatch</span>
                    <span className="brand-subtitle">Smart market monitoring</span>
                </div>
            </div>

            <div className="topbar-right">
                <button
                    type="button"
                    className="theme-toggle-button"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {isDark ? "Light" : "Dark"}
                </button>

                <div className="user-chip">
                    {isAuthenticated ? user?.firstName || user?.email : "Guest"}
                </div>
            </div>
        </header>
    );
}

export default TopBar;