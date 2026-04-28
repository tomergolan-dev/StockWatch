import type { WatchlistItem } from "../../types/watchlist.types";
import WatchlistItemCard from "./WatchlistItemCard";

type WatchlistListProps = {
    items: WatchlistItem[];
    isLoading: boolean;
    onRemoved: (symbol: string) => void;
};

/* Render the user's watchlist as responsive market cards */
function WatchlistList({ items, isLoading, onRemoved }: WatchlistListProps) {
    if (isLoading) {
        return (
            <div className="watchlist-state">
                <p className="page-description">Loading watchlist...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="watchlist-state">
                <p className="page-description">
                    Your watchlist is empty. Add stocks from the dashboard to start tracking them.
                </p>
            </div>
        );
    }

    return (
        <div className="watchlist-list">
            {items.map((item) => (
                <WatchlistItemCard
                    key={item.symbol}
                    item={item}
                    onRemoved={onRemoved}
                />
            ))}
        </div>
    );
}

export default WatchlistList;