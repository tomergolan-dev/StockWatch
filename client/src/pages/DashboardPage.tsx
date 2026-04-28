import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { searchStocks } from "../api/stocks.api";
import StockSearchBar from "../features/dashboard/StockSearchBar";
import StockSearchResults from "../features/dashboard/StockSearchResults";
import PopularStocks from "../features/stocks/PopularStocks";
import type { StockSearchItem } from "../types/stocks.types";

const dashboardLogoSrc = "/brand/stockwatch-logo.png";

/* Display the main dashboard with branding, search, results, and popular stocks */
function DashboardPage() {
    const [query, setQuery] = useState("");
    const [stocks, setStocks] = useState<StockSearchItem[]>([]);
    const [suggestions, setSuggestions] = useState<StockSearchItem[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

    const [hasSearched, setHasSearched] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getErrorMessage = (error: unknown) => {
        if (error instanceof AxiosError) {
            const responseMessage = error.response?.data?.message;

            if (typeof responseMessage === "string" && responseMessage.trim()) {
                return responseMessage;
            }
        }

        return "Failed to search stocks. Please try again.";
    };

    const closeSuggestions = () => {
        setIsSuggestionsOpen(false);
        setSuggestions([]);
    };

    const runSearch = async (value: string) => {
        const trimmedQuery = value.trim();

        closeSuggestions();

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
            setStocks([]);
            setHasSearched(true);
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleQueryChange = (value: string) => {
        setQuery(value);
        setErrorMessage("");

        if (value.trim().length >= 2) {
            setIsSuggestionsOpen(true);
            return;
        }

        closeSuggestions();
    };

    const handleSearch = () => {
        void runSearch(query);
    };

    const handleSelectSuggestion = (stock: StockSearchItem) => {
        setQuery(stock.symbol);
        void runSearch(stock.symbol);
    };

    useEffect(() => {
        document.title = "StockWatch | Dashboard";
    }, []);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (!isSuggestionsOpen || trimmedQuery.length < 2) {
            setSuggestions([]);
            setIsSuggesting(false);
            return;
        }

        const timeoutId = window.setTimeout(async () => {
            setIsSuggesting(true);

            try {
                const response = await searchStocks(trimmedQuery);
                setSuggestions(response.data.slice(0, 6));
            } catch {
                setSuggestions([]);
            } finally {
                setIsSuggesting(false);
            }
        }, 350);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [query, isSuggestionsOpen]);

    return (
        <section className="dashboard-page">
            <header className="dashboard-hero">
                <div className="dashboard-brand">
                    <img
                        src={dashboardLogoSrc}
                        alt="StockWatch logo"
                        className="dashboard-brand-logo"
                    />

                    <div className="dashboard-brand-copy">
                        <p className="dashboard-eyebrow">Market Watch</p>
                        <h1 className="dashboard-title">StockWatch</h1>
                        <p className="dashboard-description">
                            Search stocks, explore market data, track popular symbols,
                            and build your personal watchlist.
                        </p>
                    </div>
                </div>
            </header>

            <section className="dashboard-search-panel">
                <StockSearchBar
                    query={query}
                    suggestions={suggestions}
                    isLoading={isLoading}
                    isSuggesting={isSuggesting}
                    isSuggestionsOpen={isSuggestionsOpen}
                    onQueryChange={handleQueryChange}
                    onSearch={handleSearch}
                    onSelectSuggestion={handleSelectSuggestion}
                    onCloseSuggestions={closeSuggestions}
                />
            </section>

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            <StockSearchResults
                stocks={stocks}
                hasSearched={hasSearched}
                isLoading={isLoading}
            />

            <section className="dashboard-section">
                <div className="dashboard-section-header">
                    <p className="dashboard-eyebrow">Popular Stocks</p>
                    <div>
                        <h2 className="dashboard-section-title">Trending symbols</h2>
                    </div>

                    <p className="dashboard-section-description">
                        Live daily data for leading market symbols.
                    </p>
                </div>

                <PopularStocks />
            </section>
        </section>
    );
}

export default DashboardPage;