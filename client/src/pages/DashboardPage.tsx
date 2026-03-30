import { AxiosError } from "axios";
import { useState } from "react";
import { searchStocks } from "../api/stocks.api";
import StockSearchBar from "../features/dashboard/StockSearchBar";
import StockSearchResults from "../features/dashboard/StockSearchResults";
import type { StockSearchItem } from "../types/stocks.types";

/* Display the main dashboard with stock search */
function DashboardPage() {
    const [query, setQuery] = useState("");
    const [stocks, setStocks] = useState<StockSearchItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    /* Search stocks by symbol or company name */
    const handleSearch = async () => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setStocks([]);
            setHasSearched(false);
            setErrorMessage("");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await searchStocks(trimmedQuery);

            setStocks(response.data);
            setHasSearched(true);
        } catch (error: unknown) {
            let serverMessage = "Failed to search stocks. Please try again.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setStocks([]);
            setHasSearched(true);
            setErrorMessage(serverMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="page-surface dashboard-search-page">
            <div className="dashboard-search-hero">
                <div className="dashboard-search-copy">
                    <p className="dashboard-search-eyebrow">Stock Discovery</p>
                    <h1 className="page-title">Search stocks in seconds</h1>
                    <p className="page-description">
                        Explore symbols, check matching companies, and quickly add favorites to
                        your watchlist when signed in.
                    </p>
                </div>
            </div>

            <StockSearchBar
                query={query}
                isLoading={isLoading}
                onQueryChange={setQuery}
                onSearch={handleSearch}
            />

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            <StockSearchResults
                stocks={stocks}
                hasSearched={hasSearched}
                isLoading={isLoading}
            />
        </section>
    );
}

export default DashboardPage;