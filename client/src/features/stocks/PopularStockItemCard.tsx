import { AxiosError } from "axios";
import { Eye, ImageOff, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToWatchlist } from "../../api/watchlist.api";
import { useAuth } from "../../hooks/useAuth";
import { popularStockMeta, type PopularStock } from "./PopularStocks";

type PopularStockCardProps = {
    stock: PopularStock;
};

/* Display a single popular stock card */
function PopularStockItemCard({ stock }: PopularStockCardProps) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [logoFailed, setLogoFailed] = useState(false);
    const [actionMessage, setActionMessage] = useState("");

    const meta = popularStockMeta[stock.symbol];
    const isPositive = stock.change >= 0;

    const handleAddToWatchlist = async (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();
        setActionMessage("");

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        try {
            await addToWatchlist({ symbol: stock.symbol });
            setActionMessage(`${stock.symbol} added to your watchlist.`);
        } catch (error: unknown) {
            let serverMessage = "Failed to add stock to watchlist.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setActionMessage(serverMessage);
        }
    };

    return (
        <article className="popular-stock-card">
            <div className="popular-stock-header">
                <div className="popular-stock-identity">
                    <div className="popular-stock-logo-shell">
                        {!logoFailed ? (
                            <img
                                src={meta.logoUrl}
                                alt={`${meta.companyName} logo`}
                                className="popular-stock-logo"
                                loading="lazy"
                                onError={() => setLogoFailed(true)}
                            />
                        ) : (
                            <div className="popular-stock-logo-fallback">
                                <ImageOff size={18} />
                            </div>
                        )}
                    </div>

                    <div className="popular-stock-title-block">
                        <h3>{stock.symbol}</h3>
                        <p>{meta.companyName}</p>
                    </div>
                </div>

                <span
                    className={`popular-stock-change-badge ${
                        isPositive ? "positive" : "negative"
                    }`}
                >
                    {isPositive ? "+" : ""}
                    {stock.percentChange.toFixed(2)}%
                </span>
            </div>

            <div className="popular-stock-price-row">
                <strong>${stock.currentPrice.toFixed(2)}</strong>

                <span className={`popular-stock-delta ${isPositive ? "positive" : "negative"}`}>
                    {isPositive ? "+" : ""}
                    {stock.change.toFixed(2)}
                </span>
            </div>

            <div className="popular-stock-divider" />

            <div className="popular-stock-meta-grid">
                <div>
                    <span>Open</span>
                    <strong>${stock.open.toFixed(2)}</strong>
                </div>

                <div>
                    <span>High</span>
                    <strong>${stock.high.toFixed(2)}</strong>
                </div>

                <div>
                    <span>Low</span>
                    <strong>${stock.low.toFixed(2)}</strong>
                </div>
            </div>

            {actionMessage ? (
                <p className="form-success popular-stocks-message">
                    {actionMessage}
                </p>
            ) : null}

            <div className="stock-card-actions">
                <button
                    type="button"
                    className="stock-add-button"
                    onClick={handleAddToWatchlist}
                >
                    <Plus size={16} />
                    <span>Watchlist</span>
                </button>

                <button
                    type="button"
                    className="stock-view-button"
                    onClick={() => navigate(`/stock/${stock.symbol}`)}
                >
                    <Eye size={16} />
                    <span>View</span>
                </button>
            </div>
        </article>
    );
}

export default PopularStockItemCard;