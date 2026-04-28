import { AxiosError } from "axios";
import { ArrowDown, ArrowUp, BellRing, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { deleteAlert } from "../../api/alerts.api";
import type { AlertItem } from "../../types/alerts.types";

type AlertItemCardProps = {
    alert: AlertItem;
    onDeleted: (id: string) => void;
};

/* Display a modern alert card (dashboard style) */
function AlertItemCard({ alert, onDeleted }: AlertItemCardProps) {
    const navigate = useNavigate();

    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [logoFailed, setLogoFailed] = useState(false);

    const isActive = alert.isActive;
    const isPriceMetric = alert.metric === "price";
    const isDirectionUp = alert.direction === "up";

    const logoSrc = `/stock-logos/${alert.symbol.toLowerCase()}.png`;

    const handleDelete = async () => {
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
                className={`alert-stock-card ${
                    isActive ? "active-card" : "triggered-card"
                }`}
            >
                {/* HEADER */}
                <div className="alert-stock-header">
                    <div className="alert-stock-identity">
                        <div className="alert-stock-logo-shell">
                            {!logoFailed ? (
                                <img
                                    src={logoSrc}
                                    alt={`${alert.symbol} logo`}
                                    className="alert-stock-logo"
                                    loading="lazy"
                                    onError={() => setLogoFailed(true)}
                                />
                            ) : (
                                <div className="alert-stock-logo-fallback">
                                    {alert.symbol.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="alert-stock-title">
                            <h3>{alert.symbol}</h3>
                            <p>{isPriceMetric ? "Price alert" : "Percent alert"}</p>
                        </div>
                    </div>

                    <span
                        className={`alert-status ${
                            isActive ? "active" : "inactive"
                        }`}
                    >
                        {isActive ? "Active" : "Triggered"}
                    </span>
                </div>

                {/* VALUE */}
                <div className="alert-stock-value">
                    <span>Target</span>
                    <strong>
                        {isPriceMetric ? "$" : ""}
                        {alert.value}
                        {!isPriceMetric ? "%" : ""}
                    </strong>
                </div>

                {/* META */}
                <div className="alert-stock-meta">
                    <div className="alert-chip">
                        {isDirectionUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        <span>{isDirectionUp ? "Above" : "Below"}</span>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <p className="alert-description">
                    Trigger when {isPriceMetric ? "price" : "percent"} goes{" "}
                    {isDirectionUp ? "above" : "below"}{" "}
                    <strong>
                        {isPriceMetric ? "$" : ""}
                        {alert.value}
                        {!isPriceMetric ? "%" : ""}
                    </strong>
                </p>

                {/* TIME */}
                <p className="alert-triggered-at">
                    {alert.triggeredAt
                        ? `Triggered at: ${new Date(alert.triggeredAt).toLocaleString()}`
                        : "Not triggered yet"}
                </p>

                {errorMessage && (
                    <p className="form-error alert-message">{errorMessage}</p>
                )}

                {/* ACTIONS */}
                <div className="alert-card-actions">
                    <button
                        className="stock-view-button"
                        onClick={() => navigate(`/stock/${alert.symbol}`)}
                    >
                        <Eye size={16} />
                        <span>View</span>
                    </button>

                    <button
                        className={`alert-delete-button ${!isActive ? "triggered" : ""}`}
                        onClick={() => setShowConfirm(true)}
                        disabled={!isActive}
                    >
                        {isActive ? <Trash2 size={16} /> : <BellRing size={16} />}
                        <span>{isActive ? "Delete" : "Triggered"}</span>
                    </button>
                </div>
            </article>

            {/* CONFIRM MODAL */}
            {showConfirm
                ? createPortal(
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <h3>Delete alert?</h3>

                            <p>
                                Are you sure you want to delete alert for{" "}
                                <strong>{alert.symbol}</strong>?
                            </p>

                            <div className="modal-actions">
                                <button
                                    className="auth-secondary-button"
                                    onClick={() => setShowConfirm(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="alert-delete-button"
                                    onClick={handleDelete}
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