import { AxiosError } from "axios";
import { useState } from "react";
import { ArrowDown, ArrowUp, BadgePercent, DollarSign } from "lucide-react";
import { deleteAlert } from "../../api/alerts.api";
import type { AlertItem } from "../../types/alerts.types";

type AlertItemCardProps = {
    alert: AlertItem;
    onDeleted: (id: string) => void;
};

/* Display a single alert card with status, metadata, and delete action */
function AlertItemCard({ alert, onDeleted }: AlertItemCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const isActive = alert.isActive;

    const handleDelete = async () => {
        if (!isActive) {
            return;
        }

        setIsDeleting(true);
        setErrorMessage("");

        try {
            await deleteAlert(alert._id);
            onDeleted(alert._id);
        } catch (error: unknown) {
            let serverMessage = "Failed to delete alert.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setErrorMessage(serverMessage);
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <article className={`alert-card ${isActive ? "active-card" : "triggered-card"}`}>
                <div className="alert-card-main">
                    <div className="alert-card-top">
                        <div className="alert-card-title-group">
                            <h3 className="alert-symbol">{alert.symbol}</h3>

                            <span
                                className={`alert-status ${
                                    isActive ? "active" : "inactive"
                                }`}
                            >
                                {isActive ? "Active" : "Triggered"}
                            </span>
                        </div>

                        <div className="alert-meta-row">
                            <span className="alert-chip">
                                {alert.metric === "price" ? (
                                    <DollarSign size={14} />
                                ) : (
                                    <BadgePercent size={14} />
                                )}
                                <span>
                                    {alert.metric === "price" ? "Price" : "Percent"}
                                </span>
                            </span>

                            <span className="alert-chip">
                                {alert.direction === "up" ? (
                                    <ArrowUp size={14} />
                                ) : (
                                    <ArrowDown size={14} />
                                )}
                                <span>
                                    {alert.direction === "up" ? "Up" : "Down"}
                                </span>
                            </span>
                        </div>
                    </div>

                    <p className="alert-description">
                        Trigger when{" "}
                        {alert.metric === "price" ? "price" : "percent change"} goes{" "}
                        {alert.direction === "up" ? "above" : "below"}{" "}
                        <strong>{alert.value}</strong>
                    </p>

                    <p className="alert-triggered-at">
                        {alert.triggeredAt
                            ? `Triggered at: ${new Date(alert.triggeredAt).toLocaleString()}`
                            : "Not triggered yet"}
                    </p>

                    {errorMessage ? (
                        <p className="form-error alert-message">{errorMessage}</p>
                    ) : null}
                </div>

                <div className="alert-card-actions">
                    <button
                        type="button"
                        className="watchlist-remove-button"
                        onClick={() => setShowConfirm(true)}
                        disabled={!isActive || isDeleting}
                        title={!isActive ? "Triggered alerts cannot be deleted" : "Delete alert"}
                    >
                        {!isActive ? "Triggered" : "Delete Alert"}
                    </button>
                </div>
            </article>

            {showConfirm && isActive && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Delete alert?</h3>
                        <p>
                            Are you sure you want to delete the alert for{" "}
                            <strong>{alert.symbol}</strong>?
                        </p>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="auth-secondary-button"
                                onClick={() => setShowConfirm(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="watchlist-remove-button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AlertItemCard;