import StockSearchResultCard from "./StockSearchResultCard";
import type { StockSearchItem } from "../../types/stocks.types";

type StockSearchResultsProps = {
    stocks: StockSearchItem[];
    hasSearched: boolean;
    isLoading: boolean;
};

/* Render stock search results as responsive cards */
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
            <div className="dashboard-section-header compact">
                <div>
                    <p className="dashboard-eyebrow">Search Results</p>
                    <h2 className="dashboard-section-title">Matching stocks</h2>
                </div>

                <p className="dashboard-section-description">
                    Click a card to open stock details.
                </p>
            </div>

            <div className="stock-results-grid">
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