import StockSearchResultCard from "./StockSearchResultCard";
import type { StockSearchItem } from "../../types/stocks.types";

type StockSearchResultsProps = {
    stocks: StockSearchItem[];
    hasSearched: boolean;
    isLoading: boolean;
};

/* Render stock search results */
function StockSearchResults({
                                stocks,
                                hasSearched,
                                isLoading,
                            }: StockSearchResultsProps) {
    if (isLoading) {
        return (
            <section className="stock-results-state">
                <p className="page-description">Searching stocks...</p>
            </section>
        );
    }

    if (!hasSearched) {
        return null;
    }

    if (stocks.length === 0) {
        return (
            <section className="stock-results-state">
                <p className="page-description">No matching stocks were found.</p>
            </section>
        );
    }

    return (
        <section className="stock-results-section">
            <div className="stock-results-header">
                <h2>Search results</h2>
                <p>Click a result to open stock details.</p>
            </div>

            <div className="stock-results-list">
                {stocks.map((stock) => (
                    <StockSearchResultCard
                        key={`${stock.symbol}-${stock.description}`}
                        stock={stock}
                    />
                ))}
            </div>
        </section>
    );
}

export default StockSearchResults;