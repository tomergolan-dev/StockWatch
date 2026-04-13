import {axiosClient} from "./axiosClient";
import type {
    SearchStocksResponse,
    StockQuoteResponse,
} from "../types/stocks.types";

/* Search stocks by symbol or company name */
export async function searchStocks(query: string): Promise<SearchStocksResponse> {
    const response = await axiosClient.get<SearchStocksResponse>("/api/stocks/search", {
        params: {
            q: query,
        },
    });

    return response.data;
}

/* Get detailed quote data for a specific stock symbol */
export async function getStockQuote(symbol: string): Promise<StockQuoteResponse> {
    const response = await axiosClient.get<StockQuoteResponse>(`/api/stocks/${symbol}`);

    return response.data;
}