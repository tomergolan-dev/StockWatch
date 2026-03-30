import type { ChangeEvent, FormEvent } from "react";

type StockSearchBarProps = {
    query: string;
    isLoading: boolean;
    onQueryChange: (value: string) => void;
    onSearch: () => void;
};

/* Render the stock search input and search button */
function StockSearchBar({
                            query,
                            isLoading,
                            onQueryChange,
                            onSearch,
                        }: StockSearchBarProps) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onQueryChange(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch();
    };

    return (
        <form className="stock-search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search stocks (e.g. Apple, TSLA, AAPL)"
                className="stock-search-input"
            />

            <button
                type="submit"
                className="primary-button stock-search-button"
                disabled={isLoading}
            >
                {isLoading ? "Searching..." : "Search"}
            </button>
        </form>
    );
}

export default StockSearchBar;