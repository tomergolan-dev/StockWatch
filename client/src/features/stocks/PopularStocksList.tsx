import PopularStockItemCard from "./PopularStockItemCard.tsx";
import type { PopularStock } from "./PopularStocks";

type PopularStocksListProps = {
    stocks: PopularStock[];
};

/* Render popular stocks grid */
function PopularStocksList({ stocks }: PopularStocksListProps) {
    return (
        <section className="popular-stocks-section">
            <div className="popular-stocks-grid">
                {stocks.map((stock) => (
                    <PopularStockItemCard key={stock.symbol} stock={stock} />
                ))}
            </div>
        </section>
    );
}

export default PopularStocksList;