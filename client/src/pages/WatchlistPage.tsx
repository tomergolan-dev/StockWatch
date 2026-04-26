import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { getWatchlist } from "../api/watchlist.api";
import WatchlistList from "../features/watchlist/WatchlistList";
import type { WatchlistItem } from "../types/watchlist.types";

/* Display the authenticated user's watchlist page */
function WatchlistPage() {
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const stats = useMemo(() => {
        const gainers = items.filter((item) => item.change > 0);
        const losers = items.filter((item) => item.change < 0);

        const topGainer =
            gainers.length > 0
                ? gainers.reduce((prev, curr) =>
                    curr.percentChange > prev.percentChange ? curr : prev
                )
                : null;

        const topLoser =
            losers.length > 0
                ? losers.reduce((prev, curr) =>
                    curr.percentChange < prev.percentChange ? curr : prev
                )
                : null;

        return {
            total: items.length,
            gainers: gainers.length,
            losers: losers.length,
            topGainer,
            topLoser,
        };
    }, [items]);

    const loadWatchlist = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await getWatchlist();
            setItems(response.data);
        } catch (error: unknown) {
            let serverMessage = "Failed to load watchlist.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setErrorMessage(serverMessage);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoved = (symbol: string) => {
        setItems((currentItems) =>
            currentItems.filter((item) => item.symbol !== symbol)
        );
    };

    useEffect(() => {
        void loadWatchlist();
    }, []);

    return (
        <section className="page-surface watchlist-page">
            <div className="watchlist-hero">
                <div className="watchlist-copy">
                    <p className="dashboard-search-eyebrow">Your Portfolio</p>
                    <h1 className="page-title">Watchlist</h1>
                    <p className="page-description">
                        Track your favorite stocks with daily market data, create alerts,
                        and remove symbols anytime.
                    </p>
                </div>
            </div>

            {!isLoading && items.length > 0 ? (
                <div className="watchlist-stats-grid">
                    <div className="watchlist-stat-card">
                        <span>Total Stocks</span>
                        <strong>{stats.total}</strong>
                    </div>

                    <div className="watchlist-stat-card">
                        <span>Gainers</span>
                        <strong className="positive">{stats.gainers}</strong>
                    </div>

                    <div className="watchlist-stat-card">
                        <span>Losers</span>
                        <strong className="negative">{stats.losers}</strong>
                    </div>

                    <div className="watchlist-stat-card">
                        <span>Top Gainer</span>
                        <strong>
                            {stats.topGainer
                                ? `${stats.topGainer.symbol} (+${stats.topGainer.percentChange.toFixed(2)}%)`
                                : "-"}
                        </strong>
                    </div>

                    <div className="watchlist-stat-card">
                        <span>Top Loser</span>
                        <strong>
                            {stats.topLoser
                                ? `${stats.topLoser.symbol} (${stats.topLoser.percentChange.toFixed(2)}%)`
                                : "-"}
                        </strong>
                    </div>
                </div>
            ) : null}

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            <WatchlistList
                items={items}
                isLoading={isLoading}
                onRemoved={handleRemoved}
            />
        </section>
    );
}

export default WatchlistPage;