/* Dashboard placeholder with a cleaner modern look */
function DashboardPage() {
    return (
        <section className="page-surface dashboard">
            <div className="dashboard-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-description">
                    Your watchlist, alerts, and market insights - all in one place.
                </p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Watchlist</h3>
                    <p>Track your favorite stocks in real time.</p>
                </div>

                <div className="dashboard-card">
                    <h3>Alerts</h3>
                    <p>Get notified when prices hit your targets.</p>
                </div>

                <div className="dashboard-card">
                    <h3>Notifications</h3>
                    <p>Stay updated with important market changes.</p>
                </div>
            </div>
        </section>
    );
}

export default DashboardPage;