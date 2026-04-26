import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes";
import authRouter from "./routes/auth.routes";
import stockRouter from "./routes/stock.routes";
import watchlistRouter from "./routes/watchlist.routes";
import alertRouter from "./routes/alert.routes";
import notificationRouter from "./routes/notification.routes";
import userRouter from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/stocks", stockRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/alerts", alertRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/users", userRouter);

export default app;