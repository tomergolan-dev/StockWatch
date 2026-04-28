import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { getNotifications } from "../api/notifications.api";
import NotificationsList from "../features/notifications/NotificationsList";
import type { NotificationItem } from "../types/notifications.types";

type StatusFilter = "all" | "read" | "unread";
type TimeFilter = "all" | "today" | "week";

/* Display the authenticated user's notifications page */
function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

    /* Load notifications */
    const loadNotifications = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await getNotifications();
            setNotifications(response.data);
        } catch (error: unknown) {
            let serverMessage = "Failed to load notifications.";

            if (error instanceof AxiosError) {
                const responseMessage = error.response?.data?.message;

                if (typeof responseMessage === "string" && responseMessage.trim()) {
                    serverMessage = responseMessage;
                }
            }

            setNotifications([]);
            setErrorMessage(serverMessage);
        } finally {
            setIsLoading(false);
        }
    };

    /* Update single notification */
    const handleUpdated = (updated: NotificationItem) => {
        setNotifications((current) =>
            current.map((n) =>
                n._id === updated._id ? updated : n
            )
        );
    };

    useEffect(() => {
        void loadNotifications();
    }, []);

    /* Sort: unread first + newest first */
    const sortedNotifications = useMemo(() => {
        return [...notifications].sort((a, b) => {
            if (a.isRead !== b.isRead) {
                return Number(a.isRead) - Number(b.isRead); // unread first
            }

            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        });
    }, [notifications]);

    /* Multi filter */
    const filteredNotifications = useMemo(() => {
        const now = new Date();

        return sortedNotifications.filter((n) => {
            const created = new Date(n.createdAt);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "read" && n.isRead) ||
                (statusFilter === "unread" && !n.isRead);

            const matchesTime =
                timeFilter === "all" ||
                (timeFilter === "today" &&
                    created.toDateString() === now.toDateString()) ||
                (timeFilter === "week" &&
                    now.getTime() - created.getTime() <= 7 * 24 * 60 * 60 * 1000);

            return matchesStatus && matchesTime;
        });
    }, [sortedNotifications, statusFilter, timeFilter]);

    return (
        <section className="notifications-page">
            <div className="notifications-hero">
                <div className="notifications-copy">
                    <p className="dashboard-search-eyebrow">Your Notifications</p>
                    <h1 className="page-title">Notifications</h1>
                    <p className="page-description">
                        Stay updated with your alerts. Filter, sort, and manage them easily.
                    </p>
                </div>
            </div>

            {/* FILTERS */}
            <div className="notifications-toolbar">
                {/* STATUS */}
                <div className="notifications-filter-group">
                    <span className="notifications-filter-label">Status:</span>

                    <button
                        className={`notifications-filter-button ${
                            statusFilter === "all" ? "active" : ""
                        }`}
                        onClick={() => setStatusFilter("all")}
                    >
                        All
                    </button>

                    <button
                        className={`notifications-filter-button ${
                            statusFilter === "unread" ? "active" : ""
                        }`}
                        onClick={() => setStatusFilter("unread")}
                    >
                        Unread
                    </button>

                    <button
                        className={`notifications-filter-button ${
                            statusFilter === "read" ? "active" : ""
                        }`}
                        onClick={() => setStatusFilter("read")}
                    >
                        Read
                    </button>
                </div>

                {/* TIME */}
                <div className="notifications-filter-group">
                    <span className="notifications-filter-label">Time:</span>

                    <button
                        className={`notifications-filter-button ${
                            timeFilter === "all" ? "active" : ""
                        }`}
                        onClick={() => setTimeFilter("all")}
                    >
                        All
                    </button>

                    <button
                        className={`notifications-filter-button ${
                            timeFilter === "today" ? "active" : ""
                        }`}
                        onClick={() => setTimeFilter("today")}
                    >
                        Today
                    </button>

                    <button
                        className={`notifications-filter-button ${
                            timeFilter === "week" ? "active" : ""
                        }`}
                        onClick={() => setTimeFilter("week")}
                    >
                        Last 7 days
                    </button>
                </div>
            </div>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <NotificationsList
                notifications={filteredNotifications}
                isLoading={isLoading}
                onUpdated={handleUpdated}
            />
        </section>
    );
}

export default NotificationsPage;