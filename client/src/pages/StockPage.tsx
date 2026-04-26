import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosClient } from "../api/axiosClient";
import { useTheme } from "../hooks/useTheme";

type StockDetails = {
    symbol: string;
    currentPrice: number;
    change: number;
    percentChange: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
};

function StockPage() {
    const { symbol } = useParams<{ symbol: string }>();
    const { isDark } = useTheme();

    const cleanSymbol = useMemo(
        () => (symbol || "").toUpperCase().replace(/[^A-Z.]/g, ""),
        [symbol]
    );

    const [stock, setStock] = useState<StockDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadStock = async () => {
            if (!cleanSymbol) {
                setErrorMessage("Invalid stock symbol.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setErrorMessage("");

            try {
                const response = await axiosClient.get<{
                    success: boolean;
                    data: StockDetails;
                }>(`/api/stocks/${cleanSymbol}`);

                setStock(response.data.data);
            } catch (error: unknown) {
                let serverMessage = "Failed to load stock details.";

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

        void loadStock();
    }, [cleanSymbol]);

    if (isLoading) {
        return (
            <section className="page-surface stock-page">
                <div className="stock-loading-card">
                    <p className="page-description">Loading stock...</p>
                </div>
            </section>
        );
    }

    if (errorMessage || !stock) {
        return (
            <section className="page-surface stock-page">
                <p className="form-error">{errorMessage || "Stock not found."}</p>
            </section>
        );
    }

    const isPositive = stock.change >= 0;
    const chartTheme = isDark ? "dark" : "light";

    return (
        <section className="page-surface stock-page">
            <div className="stock-header">
                <div>
                    <p className="dashboard-search-eyebrow">Stock Details</p>
                    <h1 className="page-title">{stock.symbol}</h1>
                    <p className="page-description">
                        Daily market data and interactive TradingView chart.
                    </p>
                </div>

                <div className="stock-price-row">
                    <span className="stock-price">
                        ${stock.currentPrice.toFixed(2)}
                    </span>

                    <span
                        className={`stock-change-badge ${
                            isPositive ? "positive" : "negative"
                        }`}
                    >
                        {isPositive ? "+" : ""}
                        {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
                        {stock.percentChange.toFixed(2)}%)
                    </span>
                </div>
            </div>

            <div className="stock-metrics-grid">
                <div className="stock-metric-card">
                    <span>Open</span>
                    <strong>${stock.open.toFixed(2)}</strong>
                </div>

                <div className="stock-metric-card">
                    <span>High</span>
                    <strong>${stock.high.toFixed(2)}</strong>
                </div>

                <div className="stock-metric-card">
                    <span>Low</span>
                    <strong>${stock.low.toFixed(2)}</strong>
                </div>

                <div className="stock-metric-card">
                    <span>Previous Close</span>
                    <strong>${stock.previousClose.toFixed(2)}</strong>
                </div>
            </div>

            <div className="stock-chart-box">
                <iframe
                    key={`${stock.symbol}-${chartTheme}`}
                    title={`${stock.symbol} chart`}
                    src={`https://s.tradingview.com/widgetembed/?symbol=${stock.symbol}&interval=D&theme=${chartTheme}&style=1&locale=en`}
                    width="100%"
                    height="420"
                    frameBorder="0"
                />
            </div>
        </section>
    );
}

export default StockPage;