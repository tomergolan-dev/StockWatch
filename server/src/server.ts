import dotenv from "dotenv";
import app from "./app";
import { connectToDatabase } from "./config/db";
import { checkActiveAlerts } from "./services/alert-checker.service";

dotenv.config();

const PORT = process.env.PORT || 5000;
const ALERT_CHECK_INTERVAL_MS = 1000 * 30; // 5 minutes

const startServer = async (): Promise<void> => {
    try {
        await connectToDatabase();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Run one check immediately after startup
        await checkActiveAlerts();

        // Run alert checks repeatedly in the background
        setInterval(async () => {
            try {
                await checkActiveAlerts();
            } catch (error) {
                console.error("Failed to run alert checker:", error);
            }
        }, ALERT_CHECK_INTERVAL_MS);
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();