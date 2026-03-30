import StockSearchResultCard from "./StockSearchResultCard";
import type { StockSearchItem } from "../../types/stocks.types";

type StockSearchResultsProps = {
    stocks: StockSearchItem[];
    hasSearched: boolean;
    isLoading: boolean;
};

/* Render the stock search results area */
function StockSearchResults({
                                stocks,
                                hasSearched,
                                isLoading,
                            }: StockSearchResultsProps) {
    if (isLoading) {
        return (
            <div className="stock-results-state">
                <p className="page-description">Searching stocks...</p>
            </div>
        );
    }

    if (!hasSearched) {
        return (
            <div className="stock-results-state">
                <p className="page-description">
                    Search for a stock symbol or company name to get started.
                </p>
            </div>
        );
    }

    if (stocks.length === 0) {
        return (
            <div className="stock-results-state">
                <p className="page-description">
                    No matching stocks were found.
                </p>
            </div>
        );
    }

    return (
        <div className="stock-results-list">
            {stocks.map((stock) => (
                <StockSearchResultCard
                    key={`${stock.symbol}-${stock.description}`}
                    stock={stock}
                />
            ))}
        </div>
    );
}

export default StockSearchResults;