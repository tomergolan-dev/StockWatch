import { AxiosError } from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { removeFromWatchlist } from "../../api/watchlist.api";
import type { WatchlistItem } from "../../types/watchlist.types";

type WatchlistItemCardProps = {
    item: WatchlistItem;
    onRemoved: (symbol: string) => void;
};

/* Display a single watchlist stock card with actions */
function WatchlistItemCard({ item, onRemoved }: WatchlistItemCardProps) {
    const [isRemoving, setIsRemoving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const isPositive = item.change >= 0;

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
        }
    };

    return (
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
                <Link
                    to={`/alerts?symbol=${encodeURIComponent(item.symbol)}`}
                    className="auth-secondary-button watchlist-action-link"
                >
                    Create Alert
                </Link>

                <button
                    type="button"
                    className="watchlist-remove-button"
                    onClick={handleRemove}
                    disabled={isRemoving}
                >
                    {isRemoving ? "Removing..." : "Remove"}
                </button>
            </div>
        </article>
    );
}

export default WatchlistItemCard;