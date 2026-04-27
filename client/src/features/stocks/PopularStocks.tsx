import { AxiosError } from "axios";
import { Eye, ImageOff, Plus } from "lucide-react";
import { useEffect, useState } from "react";
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

type PopularStockMeta = {
    companyName: string;
    logoUrl: string;
};

const popularSymbols = ["AAPL", "MSFT", "NVDA", "GOOGL", "TSLA", "AMZN", "META", "NFLX"];

const popularStockMeta: Record<string, PopularStockMeta> = {
    AAPL: {
        companyName: "Apple Inc.",
        logoUrl: "/stock-logos/aapl.png",
    },
    MSFT: {
        companyName: "Microsoft Corp.",
        logoUrl: "/stock-logos/msft.png",
    },
    NVDA: {
        companyName: "NVIDIA Corp.",
        logoUrl: "/stock-logos/nvda.png",
    },
    GOOGL: {
        companyName: "Alphabet Inc.",
        logoUrl: "/stock-logos/googl.png",
    },
    TSLA: {
        companyName: "Tesla Inc.",
        logoUrl: "/stock-logos/tsla.png",
    },
    AMZN: {
        companyName: "Amazon.com Inc.",
        logoUrl: "/stock-logos/amzn.png",
    },
    META: {
        companyName: "Meta Platforms Inc.",
        logoUrl: "/stock-logos/meta.png",
    },
    NFLX: {
        companyName: "Netflix Inc.",
        logoUrl: "/stock-logos/nflx.png",
    },
};

/* Display popular stocks as clean market cards */
function PopularStocks() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [stocks, setStocks] = useState<PopularStock[]>([]);
    const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});
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

    const handleLogoError = (symbol: string) => {
        setFailedLogos((current) => ({
            ...current,
            [symbol]: true,
        }));
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
            <div className="popular-stocks-grid">
                {popularSymbols.map((symbol) => (
                    <article key={symbol} className="popular-stock-card skeleton" />
                ))}
            </div>
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
                    const meta = popularStockMeta[stock.symbol];
                    const isPositive = stock.change >= 0;
                    const hasLogoFailed = failedLogos[stock.symbol];

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
                            <div className="popular-stock-header">
                                <div className="popular-stock-identity">
                                    <div className="popular-stock-logo-shell">
                                        {!hasLogoFailed ? (
                                            <img
                                                src={meta.logoUrl}
                                                alt={`${meta.companyName} logo`}
                                                className="popular-stock-logo"
                                                loading="lazy"
                                                referrerPolicy="no-referrer"
                                                onError={() => handleLogoError(stock.symbol)}
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

                            <div className="stock-card-actions">
                                <button
                                    type="button"
                                    className="stock-add-button"
                                    onClick={(event) =>
                                        handleAddToWatchlist(event, stock.symbol)
                                    }
                                >
                                    <Plus size={16} />
                                    <span>Watchlist</span>
                                </button>

                                <button
                                    type="button"
                                    className="stock-view-button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        navigate(`/stock/${stock.symbol}`);
                                    }}
                                >
                                    <Eye size={16} />
                                    <span>View</span>
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default PopularStocks;