import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { getAlerts } from "../api/alerts.api";
import AlertsList from "../features/alerts/AlertsList";
import type { AlertItem } from "../types/alerts.types";

/* Display the authenticated user's alerts page */
function AlertsPage() {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

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

    const activeAlerts = useMemo(
        () => alerts.filter((alert) => alert.isActive),
        [alerts]
    );

    const inactiveAlerts = useMemo(
        () => alerts.filter((alert) => !alert.isActive),
        [alerts]
    );

    return (
        <section className="alerts-page">
            <div className="alerts-hero">
                <div className="alerts-copy">
                    <p className="dashboard-search-eyebrow">Your Alerts</p>
                    <h1 className="page-title">Alerts</h1>
                    <p className="page-description">
                        Manage active alerts, review triggered alerts, and jump directly
                        to stock details when needed.
                    </p>
                </div>
            </div>

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            <AlertsList
                activeAlerts={activeAlerts}
                inactiveAlerts={inactiveAlerts}
                isLoading={isLoading}
                onDeleted={handleDeleted}
            />
        </section>
    );
}

export default AlertsPage;