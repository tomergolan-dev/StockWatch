import { AxiosError } from "axios";
import { useState } from "react";
import { searchStocks } from "../api/stocks.api";
import StockSearchBar from "../features/dashboard/StockSearchBar";
import StockSearchResults from "../features/dashboard/StockSearchResults";
import PopularStocks from "../features/stocks/PopularStocks";
import type { StockSearchItem } from "../types/stocks.types";

/* Display the main dashboard with market overview and stock search */
function DashboardPage() {
    const [query, setQuery] = useState("");
    const [stocks, setStocks] = useState<StockSearchItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
        <section className="dashboard-showcase-page">
            <header className="dashboard-showcase-hero">
                <p className="dashboard-eyebrow">Market Watch</p>
                <h1 className="dashboard-showcase-title">Popular Stocks</h1>
                <p className="dashboard-showcase-description">
                    Daily market overview. Search a stock or click a card to view details.
                </p>
            </header>

            <div className="dashboard-control-panel single-search">
                <StockSearchBar
                    query={query}
                    isLoading={isLoading}
                    onQueryChange={setQuery}
                    onSearch={handleSearch}
                />
            </div>

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            <StockSearchResults
                stocks={stocks}
                hasSearched={hasSearched}
                isLoading={isLoading}
            />

            <PopularStocks />
        </section>
    );
}

export default DashboardPage;