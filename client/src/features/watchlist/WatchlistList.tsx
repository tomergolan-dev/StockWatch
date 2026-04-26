import WatchlistItemCard from "./WatchlistItemCard";
import type { WatchlistItem } from "../../types/watchlist.types";

type WatchlistListProps = {
    items: WatchlistItem[];
    isLoading: boolean;
    onRemoved: (symbol: string) => void;
};

/* Render the user's watchlist items with empty and loading states */
function WatchlistList({
                           items,
                           isLoading,
                           onRemoved,
                       }: WatchlistListProps) {
    if (isLoading) {
        return (
            <div className="watchlist-state">
                <p className="page-description">Loading your watchlist...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="watchlist-state">
                <p className="page-description">
                    Your watchlist is empty. Search for stocks on the dashboard and add
                    your favorites.
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