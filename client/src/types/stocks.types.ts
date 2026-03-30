/* Represent a stock search result item */
export type StockSearchItem = {
    symbol: string;
    description: string;
    type: string;
};

/* Represent the stock search API response */
export type SearchStocksResponse = {
    success: boolean;
    data: StockSearchItem[];
};

/* Represent a single stock quote item */
export type StockQuote = {
    symbol: string;
    currentPrice: number;
    change: number;
    percentChange: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
};

/* Represent the stock quote API response */
export type StockQuoteResponse = {
    success: boolean;
    data: StockQuote;
};