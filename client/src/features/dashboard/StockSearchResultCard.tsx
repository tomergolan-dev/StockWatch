import { AxiosError } from "axios";
import {ExternalLink, Eye, Plus, X} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { addToWatchlist } from "../../api/watchlist.api";
import { useAuth } from "../../hooks/useAuth";
import type { StockSearchItem } from "../../types/stocks.types";

type StockSearchResultCardProps = {
    stock: StockSearchItem;
};

/* Display a single stock search result with preview and watchlist action */
function StockSearchResultCard({ stock }: StockSearchResultCardProps) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToWatchlist = async (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();
        setMessage("");

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        setIsAdding(true);

        try {
            await addToWatchlist({ symbol: stock.symbol });
            setMessage(`${stock.symbol} added to watchlist.`);
        } catch (error: unknown) {
            let serverMessage = "Failed to add stock.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setMessage(serverMessage);
        } finally {
            setIsAdding(false);
        }
    };

    const previewModal = isPreviewOpen
        ? createPortal(
            <div className="modal-overlay">
                <div className="modal-box stock-preview-modal">
                    <div className="stock-preview-header">
                        <div>
                            <p className="dashboard-eyebrow">Stock Preview</p>
                            <h3>{stock.symbol}</h3>
                            <p className="modal-subtext">{stock.description}</p>
                        </div>

                        <button
                            type="button"
                            className="stock-preview-close"
                            onClick={() => setIsPreviewOpen(false)}
                            aria-label="Close stock preview"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="stock-preview-body">
                        <div className="stock-preview-row">
                            <span>Symbol</span>
                            <strong>{stock.symbol}</strong>
                        </div>

                        <div className="stock-preview-row">
                            <span>Company / Description</span>
                            <strong>{stock.description}</strong>
                        </div>

                        <div className="stock-preview-row">
                            <span>Type</span>
                            <strong>{stock.type || "Stock"}</strong>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="auth-secondary-button"
                            onClick={() => setIsPreviewOpen(false)}
                        >
                            Back to results
                        </button>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => navigate(`/stock/${stock.symbol}`)}
                        >
                            <ExternalLink size={16} />
                            <span>Full Details</span>
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )
        : null;

    return (
        <>
            <article className="stock-card">
                <div className="stock-card-top">
                    <div>
                        <h3 className="stock-symbol">{stock.symbol}</h3>
                        <p className="stock-description">{stock.description}</p>
                    </div>

                    <span className="stock-type-pill">{stock.type || "Stock"}</span>
                </div>

                {message ? <p className="stock-card-message">{message}</p> : null}

                <div className="stock-card-actions">
                    <button
                        type="button"
                        className="stock-add-button"
                        onClick={handleAddToWatchlist}
                        disabled={isAdding}
                    >
                        <Plus size={16} />
                        <span>{isAdding ? "Adding..." : "Add to Watchlist"}</span>
                    </button>

                    <button
                        type="button"
                        className="stock-view-button"
                        onClick={() => setIsPreviewOpen(true)}
                    >
                        <Eye size={16} />
                        <span>View</span>
                    </button>
                </div>
            </article>

            {previewModal}
        </>
    );
}

export default StockSearchResultCard;