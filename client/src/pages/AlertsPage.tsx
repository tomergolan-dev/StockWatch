import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { getAlerts } from "../api/alerts.api";
import AlertsList from "../features/alerts/AlertsList";
import type { AlertItem } from "../types/alerts.types";

type StatusFilter = "all" | "active" | "triggered";
type MetricFilter = "all" | "price" | "percent";

/* Display the authenticated user's alerts page */
function AlertsPage() {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [metricFilter, setMetricFilter] = useState<MetricFilter>("all");

    const loadAlerts = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await getAlerts();
            setAlerts(response.data);
        } catch (error: unknown) {
            let serverMessage = "Failed to load alerts.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setAlerts([]);
            setErrorMessage(serverMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleted = (id: string) => {
        setAlerts((currentAlerts) =>
            currentAlerts.filter((alert) => alert._id !== id)
        );
    };

    useEffect(() => {
        void loadAlerts();
    }, []);

    const sortedAlerts = useMemo(() => {
        return [...alerts].sort(
            (a, b) => Number(b.isActive) - Number(a.isActive)
        );
    }, [alerts]);

    const filteredAlerts = useMemo(() => {
        return sortedAlerts.filter((alert) => {
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && alert.isActive) ||
                (statusFilter === "triggered" && !alert.isActive);

            const matchesMetric =
                metricFilter === "all" || alert.metric === metricFilter;

            return matchesStatus && matchesMetric;
        });
    }, [sortedAlerts, statusFilter, metricFilter]);

    return (
        <section className="page-surface alerts-page">
            <div className="alerts-hero">
                <div className="alerts-copy">
                    <p className="dashboard-search-eyebrow">Your Alerts</p>
                    <h1 className="page-title">Alerts</h1>
                    <p className="page-description">
                        Manage active and triggered alerts, filter by status and type,
                        and keep track of price or percent movements.
                    </p>
                </div>
            </div>

            <div className="alerts-toolbar">
                <div className="alerts-filter-group">
                    <span className="alerts-filter-label">Status:</span>

                    <button
                        type="button"
                        className={`alerts-filter-button ${
                            statusFilter === "all" ? "active" : ""
                        }`}
                        onClick={() => setStatusFilter("all")}
                    >
                        All
                    </button>

                    <button
                        type="button"
                        className={`alerts-filter-button ${
                            statusFilter === "active" ? "active" : ""
                        }`}
                        onClick={() => setStatusFilter("active")}
                    >
                        Active
                    </button>

                    <button
                        type="button"
                        className={`alerts-filter-button ${
                            statusFilter === "triggered" ? "active" : ""
                        }`}
                        onClick={() => setStatusFilter("triggered")}
                    >
                        Triggered
                    </button>
                </div>

                <div className="alerts-filter-group">
                    <span className="alerts-filter-label">Type:</span>

                    <button
                        type="button"
                        className={`alerts-filter-button ${
                            metricFilter === "all" ? "active" : ""
                        }`}
                        onClick={() => setMetricFilter("all")}
                    >
                        All
                    </button>

                    <button
                        type="button"
                        className={`alerts-filter-button ${
                            metricFilter === "price" ? "active" : ""
                        }`}
                        onClick={() => setMetricFilter("price")}
                    >
                        Price
                    </button>

                    <button
                        type="button"
                        className={`alerts-filter-button ${
                            metricFilter === "percent" ? "active" : ""
                        }`}
                        onClick={() => setMetricFilter("percent")}
                    >
                        Percent
                    </button>
                </div>
            </div>

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            <AlertsList
                alerts={filteredAlerts}
                isLoading={isLoading}
                onDeleted={handleDeleted}
            />
        </section>
    );
}

export default AlertsPage;