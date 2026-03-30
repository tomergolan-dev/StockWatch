import { AxiosError } from "axios";
import { useState } from "react";
import { addToWatchlist } from "../../api/watchlist.api";
import { useAuth } from "../../hooks/useAuth";
import type { StockSearchItem } from "../../types/stocks.types";

type StockSearchResultCardProps = {
    stock: StockSearchItem;
};

/* Display a single stock search result with auth-aware actions */
function StockSearchResultCard({ stock }: StockSearchResultCardProps) {
    const { isAuthenticated } = useAuth();

    const [isAdding, setIsAdding] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleAddToWatchlist = async () => {
        setIsAdding(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const data = await addToWatchlist({
                symbol: stock.symbol,
            });

            setSuccessMessage(data.message || `${stock.symbol} added to watchlist.`);
        } catch (error: unknown) {
            let serverMessage = "Failed to add stock to watchlist.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setErrorMessage(serverMessage);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <article className="stock-result-card">
            <div className="stock-result-main">
                <div className="stock-result-top">
                    <h3 className="stock-result-symbol">{stock.symbol}</h3>
                    <span className="stock-result-type">{stock.type}</span>
                </div>

                <p className="stock-result-description">{stock.description}</p>
            </div>

            <div className="stock-result-actions">
                {isAuthenticated ? (
                    <button
                        type="button"
                        className="primary-button stock-result-button"
                        onClick={handleAddToWatchlist}
                        disabled={isAdding}
                    >
                        {isAdding ? "Adding..." : "Add to Watchlist"}
                    </button>
                ) : (
                    <p className="stock-result-guest-text">
                        Sign in to add this stock
                    </p>
                )}

                {successMessage ? (
                    <p className="form-success stock-result-message">{successMessage}</p>
                ) : null}

                {errorMessage ? (
                    <p className="form-error stock-result-message">{errorMessage}</p>
                ) : null}
            </div>
        </article>
    );
}

export default StockSearchResultCard;