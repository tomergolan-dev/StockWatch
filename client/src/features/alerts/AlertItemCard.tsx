import { AxiosError } from "axios";
import { useState } from "react";
import { createPortal } from "react-dom";
import {
    ArrowDown,
    ArrowUp,
    BadgePercent,
    BellRing,
    DollarSign,
    Trash2,
} from "lucide-react";
import { deleteAlert } from "../../api/alerts.api";
import type { AlertItem } from "../../types/alerts.types";

type AlertItemCardProps = {
    alert: AlertItem;
    onDeleted: (id: string) => void;
};

/* Display a single alert card with metadata and actions */
function AlertItemCard({ alert, onDeleted }: AlertItemCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const isActive = alert.isActive;
    const isPriceMetric = alert.metric === "price";
    const isDirectionUp = alert.direction === "up";

    const handleDelete = async () => {
        if (!isActive) {
            return;
        }

        setIsDeleting(true);
        setErrorMessage("");

        try {
            await deleteAlert(alert._id);
            onDeleted(alert._id);
            setShowConfirm(false);
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
        }
    };

    return (
        <>
            <article
                className={`alert-card ${
                    isActive ? "active-card" : "triggered-card"
                }`}
            >
                <div className="alert-card-top">
                    <div>
                        <h3 className="alert-symbol">{alert.symbol}</h3>
                        <p className="alert-subtitle">
                            {isPriceMetric ? "Price alert" : "Percent alert"}
                        </p>
                    </div>

                    <span
                        className={`alert-status ${
                            isActive ? "active" : "inactive"
                        }`}
                    >
                        {isActive ? "Active" : "Triggered"}
                    </span>
                </div>

                <div className="alert-value-block">
                    <span className="alert-value-label">Target value</span>
                    <span className="alert-value">
                        {isPriceMetric ? "$" : ""}
                        {alert.value}
                        {!isPriceMetric ? "%" : ""}
                    </span>
                </div>

                <div className="alert-meta-row">
                    <span className="alert-chip">
                        {isPriceMetric ? (
                            <DollarSign size={14} />
                        ) : (
                            <BadgePercent size={14} />
                        )}
                        <span>{isPriceMetric ? "Price" : "Percent"}</span>
                    </span>

                    <span className="alert-chip">
                        {isDirectionUp ? (
                            <ArrowUp size={14} />
                        ) : (
                            <ArrowDown size={14} />
                        )}
                        <span>{isDirectionUp ? "Up" : "Down"}</span>
                    </span>
                </div>

                <p className="alert-description">
                    Trigger when {isPriceMetric ? "price" : "percent change"} goes{" "}
                    {isDirectionUp ? "above" : "below"}{" "}
                    <strong>
                        {isPriceMetric ? "$" : ""}
                        {alert.value}
                        {!isPriceMetric ? "%" : ""}
                    </strong>
                    .
                </p>

                <p className="alert-triggered-at">
                    {alert.triggeredAt
                        ? `Triggered at: ${new Date(alert.triggeredAt).toLocaleString()}`
                        : "Not triggered yet"}
                </p>

                {errorMessage ? (
                    <p className="form-error alert-message">{errorMessage}</p>
                ) : null}

                <div className="alert-card-actions">
                    <button
                        type="button"
                        className="alert-delete-button"
                        onClick={() => setShowConfirm(true)}
                        disabled={!isActive || isDeleting}
                        title={
                            !isActive
                                ? "Triggered alerts cannot be deleted"
                                : "Delete alert"
                        }
                    >
                        {isActive ? <Trash2 size={16} /> : <BellRing size={16} />}
                        <span>{!isActive ? "Triggered" : "Delete Alert"}</span>
                    </button>
                </div>
            </article>

            {showConfirm && isActive
                ? createPortal(
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
                                    className="alert-delete-button modal-delete-button"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
                : null}
        </>
    );
}

export default AlertItemCard;