import type { AlertItem } from "../../types/alerts.types";
import AlertItemCard from "./AlertItemCard";

type AlertsListProps = {
    activeAlerts: AlertItem[];
    inactiveAlerts: AlertItem[];
    isLoading: boolean;
    onDeleted: (id: string) => void;
};

/* Render alerts in separated active and inactive sections */
function AlertsList({
                        activeAlerts,
                        inactiveAlerts,
                        isLoading,
                        onDeleted,
                    }: AlertsListProps) {
    if (isLoading) {
        return (
            <div className="alerts-state">
                <p className="page-description">Loading alerts...</p>
            </div>
        );
    }

    if (activeAlerts.length === 0 && inactiveAlerts.length === 0) {
        return (
            <div className="alerts-state">
                <p className="page-description">
                    You do not have alerts yet. Create one from your watchlist.
                </p>
            </div>
        );
    }

    return (
        <div className="alerts-sections">
            <section className="alerts-section">
                <div className="alerts-section-header">
                    <div>
                        <p className="dashboard-search-eyebrow">Active Alerts</p>

                        <div className="alerts-title-row">
                            <h2 className="alerts-section-title">Currently watching</h2>
                            <span className="alerts-section-count">{activeAlerts.length}</span>
                        </div>
                    </div>
                </div>

                {activeAlerts.length > 0 ? (
                    <div className="alerts-list">
                        {activeAlerts.map((alert) => (
                            <AlertItemCard
                                key={alert._id}
                                alert={alert}
                                onDeleted={onDeleted}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="alerts-state compact">
                        <p className="page-description">
                            No active alerts right now.
                        </p>
                    </div>
                )}
            </section>

            <section className="alerts-section">
                <div className="alerts-section-header">
                    <div>
                        <p className="dashboard-search-eyebrow">Inactive Alerts</p>

                        <div className="alerts-title-row">
                            <h2 className="alerts-section-title">Triggered history</h2>
                            <span className="alerts-section-count muted">{inactiveAlerts.length}</span>
                        </div>
                    </div>
                </div>

                {inactiveAlerts.length > 0 ? (
                    <div className="alerts-list">
                        {inactiveAlerts.map((alert) => (
                            <AlertItemCard
                                key={alert._id}
                                alert={alert}
                                onDeleted={onDeleted}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="alerts-state compact">
                        <p className="page-description">
                            No inactive alerts yet.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

export default AlertsList;