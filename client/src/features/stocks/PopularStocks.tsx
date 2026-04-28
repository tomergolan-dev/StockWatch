import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axiosClient";
import PopularStocksList from "./PopularStocksList";

export type PopularStock = {
    symbol: string;
    currentPrice: number;
    change: number;
    percentChange: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
};

export type PopularStockMeta = {
    companyName: string;
    logoUrl: string;
};

const popularSymbols = ["AAPL", "MSFT", "NVDA", "GOOGL", "TSLA", "AMZN", "META", "NFLX"];

export const popularStockMeta: Record<string, PopularStockMeta> = {
    AAPL: { companyName: "Apple Inc.", logoUrl: "/stock-logos/aapl.png" },
    MSFT: { companyName: "Microsoft Corp.", logoUrl: "/stock-logos/msft.png" },
    NVDA: { companyName: "NVIDIA Corp.", logoUrl: "/stock-logos/nvda.png" },
    GOOGL: { companyName: "Alphabet Inc.", logoUrl: "/stock-logos/googl.png" },
    TSLA: { companyName: "Tesla Inc.", logoUrl: "/stock-logos/tsla.png" },
    AMZN: { companyName: "Amazon.com Inc.", logoUrl: "/stock-logos/amzn.png" },
    META: { companyName: "Meta Platforms Inc.", logoUrl: "/stock-logos/meta.png" },
    NFLX: { companyName: "Netflix Inc.", logoUrl: "/stock-logos/nflx.png" },
};

/* Load and display popular stocks */
function PopularStocks() {
    const [stocks, setStocks] = useState<PopularStock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadPopularStocks = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const responses = await Promise.all(
                    popularSymbols.map((symbol) =>
                        axiosClient.get<{ success: boolean; data: PopularStock }>(
                            `/api/stocks/${symbol}`
                        )
                    )
                );

                setStocks(responses.map((response) => response.data.data));
            } catch (error: unknown) {
                let serverMessage = "Failed to load popular stocks.";

                if (error instanceof AxiosError) {
                    const responseMessage = error.response?.data?.message;

                    if (typeof responseMessage === "string" && responseMessage.trim()) {
                        serverMessage = responseMessage;
                    }
                }

                setErrorMessage(serverMessage);
            } finally {
                setIsLoading(false);
            }
        };

        void loadPopularStocks();
    }, []);

    if (isLoading) {
        return (
            <div className="popular-stocks-grid">
                {popularSymbols.map((symbol) => (
                    <article key={symbol} className="popular-stock-card skeleton" />
                ))}
            </div>
        );
    }

    if (errorMessage) {
        return <p className="form-error">{errorMessage}</p>;
    }

    return <PopularStocksList stocks={stocks} />;
}

export default PopularStocks;