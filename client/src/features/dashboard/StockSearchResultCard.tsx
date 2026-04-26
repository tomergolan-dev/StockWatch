import { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToWatchlist } from "../../api/watchlist.api";
import { useAuth } from "../../hooks/useAuth";
import type { StockSearchItem } from "../../types/stocks.types";

type StockSearchResultCardProps = {
    stock: StockSearchItem;
};

/* Display a single search result */
function StockSearchResultCard({ stock }: StockSearchResultCardProps) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState("");

    const handleAddToWatchlist = async (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        setIsAdding(true);
        setMessage("");

        try {
            await addToWatchlist({ symbol: stock.symbol });
            setMessage(`${stock.symbol} added to watchlist.`);
        } catch (error: unknown) {
            let serverMessage = "Failed to add stock.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setMessage(serverMessage);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <article
            className="stock-result-card"
            onClick={() => navigate(`/stock/${stock.symbol}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    navigate(`/stock/${stock.symbol}`);
                }
            }}
        >
            <div className="stock-result-logo">
                {stock.symbol.slice(0, 1)}
            </div>

            <div className="stock-result-main">
                <div className="stock-result-title-row">
                    <h3>{stock.symbol}</h3>
                    <span>{stock.type}</span>
                </div>

                <p>{stock.description}</p>
            </div>

            <div className="stock-result-actions">
                <button
                    type="button"
                    className="stock-result-button"
                    onClick={handleAddToWatchlist}
                    disabled={isAdding}
                >
                    <Plus size={16} />
                    <span>{isAdding ? "Adding..." : "Watchlist"}</span>
                </button>

                {message ? <p className="stock-result-message">{message}</p> : null}
            </div>
        </article>
    );
}

export default StockSearchResultCard;