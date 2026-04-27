import { Search } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import type { StockSearchItem } from "../../types/stocks.types";

type StockSearchBarProps = {
    query: string;
    suggestions: StockSearchItem[];
    isLoading: boolean;
    isSuggesting: boolean;
    isSuggestionsOpen: boolean;
    onQueryChange: (value: string) => void;
    onSearch: () => void;
    onSelectSuggestion: (stock: StockSearchItem) => void;
    onCloseSuggestions: () => void;
};

/* Render the stock search input, autocomplete suggestions, and search action */
function StockSearchBar({
                            query,
                            suggestions,
                            isLoading,
                            isSuggesting,
                            isSuggestionsOpen,
                            onQueryChange,
                            onSearch,
                            onSelectSuggestion,
                            onCloseSuggestions,
                        }: StockSearchBarProps) {
    const shouldShowSuggestions =
        isSuggestionsOpen && query.trim().length >= 2;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onQueryChange(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onCloseSuggestions();
        onSearch();
    };

    return (
        <form className="stock-search-form" onSubmit={handleSubmit}>
            <div className="stock-search-input-area">
                <div className="stock-search-input-shell">
                    <Search size={22} />

                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder="Search stocks by symbol or company..."
                        className="stock-search-input"
                        disabled={isLoading}
                        autoComplete="off"
                    />
                </div>

                {shouldShowSuggestions ? (
                    <div className="stock-suggestions-panel">
                        {isSuggesting ? (
                            <p className="stock-suggestion-state">Searching...</p>
                        ) : null}

                        {!isSuggesting && suggestions.length > 0
                            ? suggestions.map((stock) => (
                                <button
                                    key={`${stock.symbol}-${stock.description}`}
                                    type="button"
                                    className="stock-suggestion-item"
                                    onClick={() => onSelectSuggestion(stock)}
                                >
                                      <span className="stock-suggestion-symbol">
                                          {stock.symbol}
                                      </span>

                                    <span className="stock-suggestion-description">
                                          {stock.description}
                                      </span>
                                </button>
                            ))
                            : null}
                    </div>
                ) : null}
            </div>

            <button
                type="submit"
                className="stock-search-submit"
                disabled={isLoading}
            >
                {isLoading ? "Searching..." : "Search"}
            </button>
        </form>
    );
}

export default StockSearchBar;