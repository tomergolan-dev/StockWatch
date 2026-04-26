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

type StockBrand = {
    name: string;
    logoText: string;
    logoClass: string;
};

const popularSymbols = ["AAPL", "MSFT", "NVDA", "GOOGL", "TSLA", "AMZN"];

const stockBrands: Record<string, StockBrand> = {
    AAPL: { name: "Apple Inc.", logoText: "A", logoClass: "apple" },
    MSFT: { name: "Microsoft Corp.", logoText: "M", logoClass: "microsoft" },
    NVDA: { name: "NVIDIA Corp.", logoText: "N", logoClass: "nvidia" },
    GOOGL: { name: "Alphabet Inc.", logoText: "G", logoClass: "google" },
    TSLA: { name: "Tesla Inc.", logoText: "T", logoClass: "tesla" },
    AMZN: { name: "Amazon.com Inc.", logoText: "A", logoClass: "amazon" },
};

/* Display popular market stocks */
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

    if (isLoading) {
        return (
            <section className="popular-stocks-grid">
                {popularSymbols.map((symbol) => (
                    <article key={symbol} className="popular-stock-card skeleton" />
                ))}
            </section>
        );
    }

    if (errorMessage) {
        return <p className="form-error">{errorMessage}</p>;
    }

    return (
        <section className="popular-stocks-section">
            {actionMessage ? (
                <p className="form-success popular-stocks-message">
                    {actionMessage}
                </p>
            ) : null}

            <div className="popular-stocks-grid">
                {stocks.map((stock) => {
                    const brand = stockBrands[stock.symbol];
                    const isPositive = stock.change >= 0;

                    return (
                        <article
                            key={stock.symbol}
                            className="popular-stock-card"
                            onClick={() => navigate(`/stock/${stock.symbol}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    navigate(`/stock/${stock.symbol}`);
                                }
                            }}
                        >
                            <div className="popular-stock-header-row">
                                <div className="popular-stock-company">
                                    <div className={`popular-stock-logo ${brand.logoClass}`}>
                                        {brand.logoText}
                                    </div>

                                    <div>
                                        <h3>{stock.symbol}</h3>
                                        <p>{brand.name}</p>
                                    </div>
                                </div>

                                <span
                                    className={`popular-stock-percent ${
                                        isPositive ? "positive" : "negative"
                                    }`}
                                >
                                    {isPositive ? "+" : ""}
                                    {stock.percentChange.toFixed(2)}%
                                </span>
                            </div>

                            <div className="popular-stock-price-row">
                                <strong>${stock.currentPrice.toFixed(2)}</strong>

                                <span
                                    className={`popular-stock-delta ${
                                        isPositive ? "positive" : "negative"
                                    }`}
                                >
                                    {isPositive ? "+" : ""}
                                    {stock.change.toFixed(2)}
                                </span>
                            </div>

                            <div className="popular-stock-divider" />

                            <div className="popular-stock-meta">
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
        </section>
    );
}

export default PopularStocks;