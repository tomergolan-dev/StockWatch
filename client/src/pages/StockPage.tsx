import { AxiosError } from "axios";
import {
    ArrowLeft,
    BellPlus,
    Check,
    Plus,
    Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosClient } from "../api/axiosClient";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../api/watchlist.api";
import CreateAlertModal from "../features/alerts/CreateAlertModal.tsx";
import { useAuth } from "../hooks/useAuth";
import type { WatchlistItem } from "../types/watchlist.types";

type StockData = {
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
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [stock, setStock] = useState<StockData | null>(null);
    const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isWatchlistActionLoading, setIsWatchlistActionLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [logoFailed, setLogoFailed] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const [chartTheme, setChartTheme] = useState<"light" | "dark">(
        document.documentElement.getAttribute("data-theme") === "dark"
            ? "dark"
            : "light"
    );

    useEffect(() => {
        if (!stock) return;

        document.title = `StockWatch | ${stock.symbol} `;
    }, [stock]);

    useEffect(() => {
        if (!isAuthenticated) {
            setWatchlistItems([]);
            setShowAlertModal(false);
            setShowRemoveConfirm(false);
        }
    }, [isAuthenticated]);

    const normalizedSymbol = symbol?.replace(/[^\w.-]/g, "").toUpperCase() || "";
    const logoSrc = `/stock-logos/${normalizedSymbol.toLowerCase()}.png`;

    const isInWatchlist = useMemo(
        () =>
            watchlistItems.some(
                (item) => item.symbol.toUpperCase() === normalizedSymbol
            ),
        [watchlistItems, normalizedSymbol]
    );

    const getErrorMessage = (error: unknown, fallback: string) => {
        if (error instanceof AxiosError) {
            const responseMessage = error.response?.data?.message;

            if (typeof responseMessage === "string" && responseMessage.trim()) {
                return responseMessage;
            }
        }

        return fallback;
    };

    const loadStock = async () => {
        if (!normalizedSymbol) {
            setErrorMessage("Invalid stock symbol.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            const stockResponse = await axiosClient.get<{
                success: boolean;
                data: StockData;
            }>(`/api/stocks/${normalizedSymbol}`);

            setStock(stockResponse.data.data);

            if (isAuthenticated) {
                const watchlistResponse = await getWatchlist();
                setWatchlistItems(watchlistResponse.data);
            }
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to load stock."));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToWatchlist = async () => {
        setActionMessage("");

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        setIsWatchlistActionLoading(true);

        try {
            await addToWatchlist({ symbol: normalizedSymbol });
            const response = await getWatchlist();

            setWatchlistItems(response.data);
            setActionMessage(`${normalizedSymbol} added to your watchlist.`);
        } catch (error: unknown) {
            setActionMessage(
                getErrorMessage(error, "Failed to add stock to watchlist.")
            );
        } finally {
            setIsWatchlistActionLoading(false);
        }
    };

    const handleRemoveFromWatchlist = async () => {
        setActionMessage("");

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        setIsWatchlistActionLoading(true);

        try {
            await removeFromWatchlist(normalizedSymbol);

            setWatchlistItems((currentItems) =>
                currentItems.filter(
                    (item) => item.symbol.toUpperCase() !== normalizedSymbol
                )
            );

            setActionMessage(`${normalizedSymbol} removed from your watchlist.`);
        } catch (error: unknown) {
            setActionMessage(
                getErrorMessage(error, "Failed to remove stock from watchlist.")
            );
        } finally {
            setIsWatchlistActionLoading(false);
        }
    };

    useEffect(() => {
        const updateChartTheme = () => {
            setChartTheme(
                document.documentElement.getAttribute("data-theme") === "dark"
                    ? "dark"
                    : "light"
            );
        };

        updateChartTheme();

        const observer = new MutationObserver(updateChartTheme);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        void loadStock();
    }, [normalizedSymbol, isAuthenticated]);

    if (isLoading) {
        return (
            <section className="stock-page">
                <div className="stock-state">
                    <p className="page-description">Loading stock...</p>
                </div>
            </section>
        );
    }

    if (errorMessage || !stock) {
        return (
            <section className="stock-page">
                <div className="stock-state">
                    <p className="form-error">{errorMessage || "Stock not found."}</p>
                </div>
            </section>
        );
    }

    const isPositive = stock.change >= 0;

    return (
        <section className="stock-page">
            <div className="stock-hero">
                <button
                    type="button"
                    className="stock-back-button"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>

                <div className="stock-hero-main">
                    <div className="stock-hero-identity">
                        <div className="stock-logo-shell">
                            {!logoFailed ? (
                                <img
                                    src={logoSrc}
                                    alt={`${stock.symbol} logo`}
                                    onError={() => setLogoFailed(true)}
                                />
                            ) : (
                                <div className="stock-logo-fallback">
                                    {stock.symbol.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div>
                            <h1 className="stock-title">{stock.symbol}</h1>
                            <p className="stock-subtitle">Stock overview</p>
                        </div>
                    </div>

                    <div className="stock-price-block">
                        <div className="stock-price-row">
                            <span className="stock-price">
                                ${stock.currentPrice.toFixed(2)}
                            </span>

                            <span
                                className={`stock-change ${
                                    isPositive ? "positive" : "negative"
                                }`}
                            >
                                {isPositive ? "+" : ""}
                                {stock.change.toFixed(2)}
                            </span>

                            <span
                                className={`stock-change-badge ${
                                    isPositive ? "positive" : "negative"
                                }`}
                            >
                                {isPositive ? "+" : ""}
                                {stock.percentChange.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="stock-actions">
                    {!isInWatchlist ? (
                        <button
                            type="button"
                            className="stock-action-button primary"
                            onClick={handleAddToWatchlist}
                            disabled={isWatchlistActionLoading}
                        >
                            <Plus size={16} />
                            <span>
                                {isWatchlistActionLoading ? "Adding..." : "Watchlist"}
                            </span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="stock-action-button tracked"
                            disabled
                        >
                            <Check size={16} />
                            <span>In Watchlist</span>
                        </button>
                    )}

                    {isInWatchlist ? (
                        <>
                            <button
                                type="button"
                                className="stock-action-button secondary"
                                onClick={() => setShowAlertModal(true)}
                            >
                                <BellPlus size={16} />
                                <span>Create Alert</span>
                            </button>

                            <button
                                type="button"
                                className="stock-action-button danger"
                                onClick={() => setShowRemoveConfirm(true)}
                                disabled={isWatchlistActionLoading}
                            >
                                <Trash2 size={16} />
                                <span>
                                    {isWatchlistActionLoading ? "Removing..." : "Remove"}
                                </span>
                            </button>
                        </>
                    ) : null}
                </div>

                {actionMessage ? (
                    <p className="form-success stock-action-message">
                        {actionMessage}
                    </p>
                ) : null}
            </div>

            <div className="stock-metrics-clean">
                <div>
                    <span>Open</span>
                    <strong>${stock.open.toFixed(2)}</strong>
                </div>

                <div>
                    <span>High</span>
                    <strong>${stock.high.toFixed(2)}</strong>
                </div>

                <div>
                    <span>Low</span>
                    <strong>${stock.low.toFixed(2)}</strong>
                </div>

                <div>
                    <span>Prev Close</span>
                    <strong>${stock.previousClose.toFixed(2)}</strong>
                </div>
            </div>

            <div className="stock-chart-box">
                <iframe
                    key={`${stock.symbol}-${chartTheme}`}
                    title={`${stock.symbol} stock chart`}
                    src={`https://s.tradingview.com/widgetembed/?symbol=${stock.symbol}&interval=D&hidesidetoolbar=1&hidetoptoolbar=1&theme=${chartTheme}&style=1`}
                />
            </div>

            {showAlertModal ? (
                <CreateAlertModal
                    symbol={stock.symbol}
                    onClose={() => setShowAlertModal(false)}
                />
            ) : null}

            {showRemoveConfirm ? (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Remove stock?</h3>

                        <p>
                            Are you sure you want to remove{" "}
                            <strong>{stock.symbol}</strong> from your watchlist?
                        </p>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="auth-secondary-button"
                                onClick={() => setShowRemoveConfirm(false)}
                                disabled={isWatchlistActionLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="stock-action-button danger"
                                onClick={async () => {
                                    await handleRemoveFromWatchlist();
                                    setShowRemoveConfirm(false);
                                }}
                                disabled={isWatchlistActionLoading}
                            >
                                {isWatchlistActionLoading ? "Removing..." : "Yes, Remove"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}

export default StockPage;