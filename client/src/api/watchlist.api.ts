import { axiosClient } from "./axiosClient";
import type {
    WatchlistResponse,
    WatchlistMutationResponse,
    AddToWatchlistPayload,
} from "../types/watchlist.types";

/* Get the authenticated user's watchlist */
export async function getWatchlist(): Promise<WatchlistResponse> {
    const response = await axiosClient.get<WatchlistResponse>("/watchlist");
    return response.data;
}

/* Add a stock to the authenticated user's watchlist */
export async function addToWatchlist(
    payload: AddToWatchlistPayload
): Promise<WatchlistMutationResponse> {
    const response = await axiosClient.post<WatchlistMutationResponse>(
        "/watchlist",
        payload
    );

    return response.data;
}

/* Remove a stock from the authenticated user's watchlist */
export async function removeFromWatchlist(
    symbol: string
): Promise<WatchlistMutationResponse> {
    const response = await axiosClient.delete<WatchlistMutationResponse>(
        `/watchlist/${symbol}`
    );

    return response.data;
}