import { AxiosError } from "axios";
import { BellPlus, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { removeFromWatchlist } from "../../api/watchlist.api";
import type { WatchlistItem } from "../../types/watchlist.types";
import CreateAlertModal from "../alerts/CreateAlertModal.tsx";

type WatchlistItemCardProps = {
    item: WatchlistItem;
    onRemoved: (symbol: string) => void;
};

/* Display a watchlist stock card with market data and actions */
function WatchlistItemCard({ item, onRemoved }: WatchlistItemCardProps) {
    const navigate = useNavigate();

    const [isRemoving, setIsRemoving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [logoFailed, setLogoFailed] = useState(false);

    const isPositive = item.change >= 0;
    const logoSrc = `/stock-logos/${item.symbol.toLowerCase()}.png`;

    const handleRemove = async () => {
        setIsRemoving(true);
        setErrorMessage("");

        try {
            await removeFromWatchlist(item.symbol);
            onRemoved(item.symbol);
            setShowConfirm(false);
        } catch (error: unknown) {
            let serverMessage = "Failed to remove stock.";

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
            <article className="watchlist-stock-card">
                <div className="watchlist-stock-header">
                    <div className="watchlist-stock-identity">
                        <div className="watchlist-stock-logo-shell">
                            {!logoFailed ? (
                                <img
                                    src={logoSrc}
                                    alt={`${item.symbol} logo`}
                                    className="watchlist-stock-logo"
                                    loading="lazy"
                                    onError={() => setLogoFailed(true)}
                                />
                            ) : (
                                <div className="watchlist-stock-logo-fallback">
                                    {item.symbol.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="watchlist-stock-title-block">
                            <h3>{item.symbol}</h3>
                            <p>{item.companyName}</p>
                        </div>
                    </div>

                    <span
                        className={`watchlist-stock-change-badge ${
                            isPositive ? "positive" : "negative"
                        }`}
                    >
                        {isPositive ? "+" : ""}
                        {item.percentChange.toFixed(2)}%
                    </span>
                </div>

                <div className="watchlist-stock-price-row">
                    <strong>${item.currentPrice.toFixed(2)}</strong>

                    <span
                        className={`watchlist-stock-delta ${
                            isPositive ? "positive" : "negative"
                        }`}
                    >
                        {isPositive ? "+" : ""}
                        {item.change.toFixed(2)}
                    </span>
                </div>

                <div className="watchlist-stock-divider" />

                <div className="watchlist-stock-meta-grid">
                    <div>
                        <span>Open</span>
                        <strong>${item.open.toFixed(2)}</strong>
                    </div>

                    <div>
                        <span>High</span>
                        <strong>${item.high.toFixed(2)}</strong>
                    </div>

                    <div>
                        <span>Low</span>
                        <strong>${item.low.toFixed(2)}</strong>
                    </div>
                </div>

                {errorMessage ? (
                    <p className="form-error watchlist-message">{errorMessage}</p>
                ) : null}

                <div className="watchlist-card-actions">
                    <button
                        type="button"
                        className="watchlist-alert-button"
                        onClick={() => setShowAlertModal(true)}
                    >
                        <BellPlus size={16} />
                        <span>Alert</span>
                    </button>

                    <button
                        type="button"
                        className="watchlist-view-button"
                        onClick={() => navigate(`/stock/${item.symbol}`)}
                    >
                        <Eye size={16} />
                        <span>View</span>
                    </button>

                    <button
                        type="button"
                        className="watchlist-remove-button"
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