import { Search } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";

type StockSearchBarProps = {
    query: string;
    isLoading: boolean;
    onQueryChange: (value: string) => void;
    onSearch: () => void;
};

/* Render the stock search input */
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
            <div className="stock-search-input-shell">
                <Search size={22} />

                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search stocks..."
                    className="stock-search-input"
                    disabled={isLoading}
                />
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