import { AxiosError } from "axios";
import { useState } from "react";
import { removeFromWatchlist } from "../../api/watchlist.api";
import type { WatchlistItem } from "../../types/watchlist.types";
import CreateAlertModal from "./CreateAlertModal";

type WatchlistItemCardProps = {
    item: WatchlistItem;
    onRemoved: (symbol: string) => void;
};

/* Display a single watchlist stock card with actions */
function WatchlistItemCard({ item, onRemoved }: WatchlistItemCardProps) {
    const [isRemoving, setIsRemoving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);

    const isPositive = item.change >= 0;

    /* Remove the stock from the authenticated user's watchlist */
    const handleRemove = async () => {
        setIsRemoving(true);
        setErrorMessage("");

        try {
            await removeFromWatchlist(item.symbol);
            onRemoved(item.symbol);
        } catch (error: unknown) {
            let serverMessage = "Failed to remove stock from watchlist.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setErrorMessage(serverMessage);
        } finally {
            setIsRemoving(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <article className="watchlist-card">
                <div className="watchlist-card-main">
                    <div className="watchlist-card-top">
                        <div>
                            <h3 className="watchlist-symbol">{item.symbol}</h3>
                            <p className="watchlist-company-name">{item.companyName}</p>
                        </div>

                        <div className="watchlist-price-block">
                            <p className="watchlist-price">${item.currentPrice.toFixed(2)}</p>
                            <p
                                className={`watchlist-change ${
                                    isPositive ? "positive" : "negative"
                                }`}
                            >
                                {isPositive ? "+" : ""}
                                {item.change.toFixed(2)} ({isPositive ? "+" : ""}
                                {item.percentChange.toFixed(2)}%)
                            </p>
                        </div>
                    </div>

                    {errorMessage ? (
                        <p className="form-error watchlist-message">{errorMessage}</p>
                    ) : null}
                </div>

                <div className="watchlist-card-actions">
                    <button
                        type="button"
                        className="watchlist-action-link"
                        onClick={() => setShowAlertModal(true)}
                    >
                        Create Alert
                    </button>

                    <button
                        type="button"
                        className="watchlist-remove-button"
                        onClick={() => setShowConfirm(true)}
                    >
                        Remove
                    </button>
                </div>
            </article>

            {/* Confirm delete modal */}
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Remove stock?</h3>
                        <p>
                            Are you sure you want to remove <strong>{item.symbol}</strong> from your watchlist?
                        </p>

                        <div className="modal-actions">
                            <button
                                className="auth-secondary-button"
                                onClick={() => setShowConfirm(false)}
                                disabled={isRemoving}
                            >
                                Cancel
                            </button>

                            <button
                                className="watchlist-remove-button"
                                onClick={handleRemove}
                                disabled={isRemoving}
                            >
                                {isRemoving ? "Removing..." : "Yes, Remove"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create alert modal */}
            {showAlertModal && (
                <CreateAlertModal
                    symbol={item.symbol}
                    onClose={() => setShowAlertModal(false)}
                />
            )}
        </>
    );
}

export default WatchlistItemCard;