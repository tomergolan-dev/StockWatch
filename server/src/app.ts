import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes";
import authRouter from "./routes/auth.routes";
import stockRouter from "./routes/stock.routes";
import watchlistRouter from "./routes/watchlist.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/stocks", stockRouter);
app.use("/api/watchlist", watchlistRouter);

export default app;