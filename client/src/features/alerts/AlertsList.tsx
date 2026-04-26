import AlertItemCard from "./AlertItemCard";
import type { AlertItem } from "../../types/alerts.types";

type AlertsListProps = {
    alerts: AlertItem[];
    isLoading: boolean;
    onDeleted: (id: string) => void;
};

/* Render alerts with loading and empty states */
function AlertsList({ alerts, isLoading, onDeleted }: AlertsListProps) {
    if (isLoading) {
        return (
            <div className="alerts-state">
                <p className="page-description">Loading your alerts...</p>
            </div>
        );
    }

    if (alerts.length === 0) {
        return (
            <div className="alerts-state">
                <p className="page-description">
                    No alerts match the current filters.
                </p>
            </div>
        );
    }

    return (
        <div className="alerts-list">
            {alerts.map((alert) => (
                <AlertItemCard
                    key={alert._id}
                    alert={alert}
                    onDeleted={onDeleted}
                />
            ))}
        </div>
    );
}

export default AlertsList;