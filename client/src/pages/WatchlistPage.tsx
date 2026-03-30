import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { getWatchlist } from "../api/watchlist.api";
import WatchlistList from "../features/watchlist/WatchlistList";
import type { WatchlistItem } from "../types/watchlist.types";

/* Display the authenticated user's watchlist page */
function WatchlistPage() {
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    /* Load the user's watchlist from the backend */
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

    /* Remove a stock locally after a successful delete request */
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
                    <p className="dashboard-search-eyebrow">Your Favorites</p>
                    <h1 className="page-title">Watchlist</h1>
                    <p className="page-description">
                        Track the stocks you care about most, remove symbols anytime,
                        and jump directly to alert creation.
                    </p>
                </div>
            </div>

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