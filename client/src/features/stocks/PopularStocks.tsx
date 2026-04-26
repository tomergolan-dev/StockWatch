import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../api/axiosClient";
import { addToWatchlist } from "../../api/watchlist.api";
import { useAuth } from "../../hooks/useAuth";

type PopularStock = {
    symbol: string;
    currentPrice: number;
    change: number;
    percentChange: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
};

const popularSymbols = ["AAPL", "NVDA", "MSFT", "TSLA", "AMZN", "GOOGL"];

/* Display popular stocks on the dashboard */
function PopularStocks() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [stocks, setStocks] = useState<PopularStock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    const loadPopularStocks = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const responses = await Promise.all(
                popularSymbols.map((symbol) =>
                    axiosClient.get<{ success: boolean; data: PopularStock }>(
                        `/api/stocks/${symbol}`
                    )
                )
            );

            setStocks(responses.map((response) => response.data.data));
        } catch (error: unknown) {
            let serverMessage = "Failed to load popular stocks.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setErrorMessage(serverMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToWatchlist = async (
        event: React.MouseEvent<HTMLButtonElement>,
        symbol: string
    ) => {
        event.stopPropagation();
        setActionMessage("");

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        try {
            await addToWatchlist({ symbol });
            setActionMessage(`${symbol} added to your watchlist.`);
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

    useEffect(() => {
        void loadPopularStocks();
    }, []);

    return (
        <section className="popular-stocks-section">
            <div className="popular-stocks-header">
                <div>
                    <p className="dashboard-search-eyebrow">Market Watch</p>
                    <h2 className="popular-stocks-title">Popular Stocks</h2>
                    <p className="popular-stocks-description">
                        Daily market overview. Click a stock card to view details and charts.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="popular-stocks-grid">
                    {popularSymbols.map((symbol) => (
                        <div className="popular-stock-card skeleton" key={symbol} />
                    ))}
                </div>
            ) : null}

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            {actionMessage ? (
                <p className="form-success popular-stocks-message">
                    {actionMessage}
                </p>
            ) : null}

            {!isLoading && !errorMessage ? (
                <div className="popular-stocks-grid">
                    {stocks.map((stock) => {
                        const isPositive = stock.change >= 0;

                        return (
                            <article
                                className="popular-stock-card clickable-stock-card"
                                key={stock.symbol}
                                onClick={() => navigate(`/stock/${stock.symbol}`)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        navigate(`/stock/${stock.symbol}`);
                                    }
                                }}
                            >
                                <div className="popular-stock-top">
                                    <div>
                                        <h3>{stock.symbol}</h3>
                                        <p>Popular market symbol</p>
                                    </div>

                                    <span
                                        className={`popular-stock-change ${
                                            isPositive ? "positive" : "negative"
                                        }`}
                                    >
                                        {isPositive ? "+" : ""}
                                        {stock.percentChange.toFixed(2)}%
                                    </span>
                                </div>

                                <div className="popular-stock-price-row">
                                    <span className="popular-stock-price">
                                        ${stock.currentPrice.toFixed(2)}
                                    </span>

                                    <span
                                        className={`popular-stock-delta ${
                                            isPositive ? "positive" : "negative"
                                        }`}
                                    >
                                        {isPositive ? "+" : ""}
                                        {stock.change.toFixed(2)}
                                    </span>
                                </div>

                                <div className="popular-stock-meta">
                                    <span>Open ${stock.open.toFixed(2)}</span>
                                    <span>High ${stock.high.toFixed(2)}</span>
                                    <span>Low ${stock.low.toFixed(2)}</span>
                                </div>

                                <button
                                    type="button"
                                    className="popular-stock-button"
                                    onClick={(event) =>
                                        handleAddToWatchlist(event, stock.symbol)
                                    }
                                >
                                    <Plus size={16} />
                                    <span>Add to Watchlist</span>
                                </button>
                            </article>
                        );
                    })}
                </div>
            ) : null}
        </section>
    );
}

export default PopularStocks;