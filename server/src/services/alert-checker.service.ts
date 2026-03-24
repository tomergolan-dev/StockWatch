import AlertModel from "../models/alert.model";
import UserModel from "../models/user.model";
import { getStockQuote } from "./stock.service";
import { createNotification } from "./notification.service";
import { sendEmail } from "../utils/mailer";

/**
 * Check whether an alert condition is met.
 *
 * Supported cases:
 * 1. price + up     => currentPrice >= target value
 * 2. price + down   => currentPrice <= target value
 * 3. percent + up   => percentChange >= target value
 * 4. percent + down => percentChange <= -target value
 */
const isAlertTriggered = (
    metric: "price" | "percent",
    direction: "up" | "down",
    value: number,
    currentPrice: number,
    percentChange: number
): boolean => {
    // Price-based alert logic
    if (metric === "price") {
        // Trigger when price reaches or rises above the target
        if (direction === "up") {
            return currentPrice >= value;
        }

        // Trigger when price falls to or below the target
        return currentPrice <= value;
    }

    // Percent-based alert logic
    if (direction === "up") {
        // Trigger when daily percent change reaches or exceeds the target
        return percentChange >= value;
    }

    // Trigger when daily percent change drops to the negative target or lower
    return percentChange <= -value;
};

/**
 * Build a user-friendly message for a triggered alert.
 */
const buildAlertMessage = (
    symbol: string,
    metric: "price" | "percent",
    direction: "up" | "down",
    value: number,
    currentPrice: number,
    percentChange: number
) => {
    // Message for price-based alerts
    if (metric === "price") {
        const directionText = direction === "up" ? "rose to" : "fell to";

        return {
            title: "Price Alert Triggered",
            message: `${symbol} ${directionText} $${currentPrice}, crossing your target of $${value}.`
        };
    }

    // Message for percent-based alerts
    const directionText = direction === "up" ? "increased by" : "decreased by";

    return {
        title: "Percent Alert Triggered",
        message: `${symbol} ${directionText} ${Math.abs(percentChange)}%, reaching your target of ${value}%.`
    };
};

/**
 * Check all active alerts and trigger the matching ones.
 */
export const checkActiveAlerts = async (): Promise<void> => {
    // Load only active alerts
    const activeAlerts = await AlertModel.find({ isActive: true });

    for (const alert of activeAlerts) {
        try {
            // Fetch live stock data for the alert symbol
            const stockData = await getStockQuote(alert.symbol);

            // Decide whether this alert should fire
            const triggered = isAlertTriggered(
                alert.metric,
                alert.direction,
                alert.value,
                stockData.currentPrice,
                stockData.percentChange
            );

            // Skip alerts whose condition is not met yet
            if (!triggered) {
                continue;
            }

            // Load the user who owns the alert
            const user = await UserModel.findById(alert.userId);

            if (!user) {
                continue;
            }

            // Build message for email + in-app notification
            const { title, message } = buildAlertMessage(
                alert.symbol,
                alert.metric,
                alert.direction,
                alert.value,
                stockData.currentPrice,
                stockData.percentChange
            );

            // Send alert email
            await sendEmail({
                to: user.email,
                subject: `${title} - StockWatch`,
                html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>${title}</h2>
            <p>${message}</p>
          </div>
        `
            });

            // Create in-app notification
            await createNotification({
                userId: String(user._id),
                symbol: alert.symbol,
                title,
                message,
                emailSent: true
            });

            // Disable the alert after it triggers once
            alert.isActive = false;
            alert.triggeredAt = new Date();
            await alert.save();
        } catch (error) {
            console.error(`Failed to process alert ${alert._id}:`, error);
        }
    }
};