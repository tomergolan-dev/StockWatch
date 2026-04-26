import { AxiosError } from "axios";
import { useState } from "react";
import { createPortal } from "react-dom";
import { BellPlus, Trash2 } from "lucide-react";
import { removeFromWatchlist } from "../../api/watchlist.api";
import type { WatchlistItem } from "../../types/watchlist.types";
import CreateAlertModal from "./CreateAlertModal";

type WatchlistItemCardProps = {
    item: WatchlistItem;
    onRemoved: (symbol: string) => void;
};

/* Display a single watchlist stock card with market data and actions */
function WatchlistItemCard({ item, onRemoved }: WatchlistItemCardProps) {
    const [isRemoving, setIsRemoving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);

    const isPositive = item.change >= 0;

    const handleRemove = async () => {
        setIsRemoving(true);
        setErrorMessage("");

        try {
            await removeFromWatchlist(item.symbol);
            onRemoved(item.symbol);
            setShowConfirm(false);
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
        }
    };

    return (
        <>
            <article className="watchlist-card market-stock-card">
                <div className="market-stock-top">
                    <div>
                        <h3 className="market-stock-symbol">{item.symbol}</h3>
                        <p className="market-stock-company">{item.companyName}</p>
                    </div>

                    <span
                        className={`market-stock-change-badge ${
                            isPositive ? "positive" : "negative"
                        }`}
                    >
                        {isPositive ? "+" : ""}
                        {item.percentChange.toFixed(2)}%
                    </span>
                </div>

                <div className="market-stock-price-row">
                    <span className="market-stock-price">
                        ${item.currentPrice.toFixed(2)}
                    </span>

                    <span
                        className={`market-stock-delta ${
                            isPositive ? "positive" : "negative"
                        }`}
                    >
                        {isPositive ? "+" : ""}
                        {item.change.toFixed(2)}
                    </span>
                </div>

                <div className="market-stock-meta">
                    <span>Open ${item.open.toFixed(2)}</span>
                    <span>High ${item.high.toFixed(2)}</span>
                    <span>Low ${item.low.toFixed(2)}</span>
                </div>

                {errorMessage ? (
                    <p className="form-error watchlist-message">{errorMessage}</p>
                ) : null}

                <div className="market-stock-actions">
                    <button
                        type="button"
                        className="market-stock-action-button"
                        onClick={() => setShowAlertModal(true)}
                    >
                        <BellPlus size={16} />
                        <span>Create Alert</span>
                    </button>

                    <button
                        type="button"
                        className="market-stock-remove-button"
                        onClick={() => setShowConfirm(true)}
                    >
                        <Trash2 size={16} />
                        <span>Remove</span>
                    </button>
                </div>
            </article>

            {showConfirm
                ? createPortal(
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <h3>Remove stock?</h3>

                            <p>
                                Are you sure you want to remove{" "}
                                <strong>{item.symbol}</strong> from your watchlist?
                            </p>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="auth-secondary-button"
                                    onClick={() => setShowConfirm(false)}
                                    disabled={isRemoving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="watchlist-remove-button"
                                    onClick={handleRemove}
                                    disabled={isRemoving}
                                >
                                    {isRemoving ? "Removing..." : "Yes, Remove"}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
                : null}

            {showAlertModal ? (
                <CreateAlertModal
                    symbol={item.symbol}
                    onClose={() => setShowAlertModal(false)}
                />
            ) : null}
        </>
    );
}

export default WatchlistItemCard;