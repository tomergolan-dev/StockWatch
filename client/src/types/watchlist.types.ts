/* Represent a single watchlist item */
export type WatchlistItem = {
    symbol: string;
    companyName: string;
    currentPrice: number;
    change: number;
    percentChange: number;
    open: number;
    high: number;
    low: number;
    previousClose?: number;
};

/* Represent the watchlist response */
export type WatchlistResponse = {
    success: boolean;
    data: WatchlistItem[];
};

/* Represent the add-to-watchlist request */
export type AddToWatchlistPayload = {
    symbol: string;
};

/* Represent a generic mutation response */
export type WatchlistMutationResponse = {
    success: boolean;
    message?: string;
};