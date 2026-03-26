import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideDrawer from "./SideDrawer";
import TopBar from "./TopBar";

/* Provide the main application shell */
function AppLayout() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const openDrawer = () => {
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="app-shell">
            <TopBar onMenuToggle={openDrawer} />
            <SideDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />

            <main className="app-main">
                <div className="app-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AppLayout;