import { AxiosError } from "axios";
import { useState } from "react";
import { createAlert } from "../../api/alerts.api";
import type { CreateAlertPayload } from "../../types/alerts.types";

type CreateAlertModalProps = {
    symbol: string;
    onClose: () => void;
};

/* Display a modal for creating a new alert */
function CreateAlertModal({ symbol, onClose }: CreateAlertModalProps) {
    const [metric, setMetric] = useState<"price" | "percent">("price");
    const [direction, setDirection] = useState<"up" | "down">("up");
    const [value, setValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        const numericValue = Number(value);

        if (!numericValue || numericValue <= 0) {
            setErrorMessage("Please enter a valid value.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        const payload: CreateAlertPayload = {
            symbol,
            metric,
            direction,
            value: numericValue,
        };

        try {
            await createAlert(payload);
            setSuccess(true);
        } catch (error: unknown) {
            let serverMessage = "Failed to create alert.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setErrorMessage(serverMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                {!success ? (
                    <>
                        <h3>Create Alert</h3>

                        <p className="modal-subtext">
                            Symbol: <strong>{symbol}</strong>
                        </p>

                        <div className="form-group">
                            <label>Metric</label>
                            <select
                                value={metric}
                                onChange={(e) =>
                                    setMetric(e.target.value as "price" | "percent")
                                }
                            >
                                <option value="price">Price</option>
                                <option value="percent">Percent</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Direction</label>
                            <select
                                value={direction}
                                onChange={(e) =>
                                    setDirection(e.target.value as "up" | "down")
                                }
                            >
                                <option value="up">Up</option>
                                <option value="down">Down</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Target Value</label>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Enter value"
                            />
                        </div>

                        {errorMessage && (
                            <p className="form-error">{errorMessage}</p>
                        )}

                        <div className="modal-actions">
                            <button
                                className="auth-secondary-button"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>

                            <button
                                className="primary-button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creating..." : "Create Alert"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3>Alert Created 🎉</h3>

                        <p className="page-description">
                            Your alert for <strong>{symbol}</strong> was created successfully.
                        </p>

                        <div className="modal-actions">
                            <button
                                className="auth-secondary-button"
                                onClick={onClose}
                            >
                                Close
                            </button>

                            <a href="/alerts" className="primary-button">
                                Go to Alerts
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CreateAlertModal;