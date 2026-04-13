import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../../api/notifications.api";
import NotificationsList from "./NotificationsList";
import type { NotificationItem } from "../../types/notifications.types";

type NotificationsPanelProps = {
    isOpen: boolean;
    onClose: () => void;
};

/* Display notifications panel from top bar */
function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

    /* Update notification locally */
    const handleUpdated = (updated: NotificationItem) => {
        setNotifications((current) =>
            current.map((n) =>
                n._id === updated._id ? updated : n
            )
        );
    };

    /* Sort: unread first */
    const sortedNotifications = [...notifications].sort(
        (a, b) => Number(a.isRead) - Number(b.isRead)
    );

    /* Limit for panel */
    const limitedNotifications = sortedNotifications.slice(0, 6);

    useEffect(() => {
        if (!isOpen) return;
        void loadNotifications();
    }, [isOpen]);

    /* Close on outside click */
    useEffect(() => {
        if (!isOpen) return;

        const handleClick = (event: MouseEvent) => {
            const target = event.target as Node;

            if (panelRef.current && !panelRef.current.contains(target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [isOpen, onClose]);

    /* Close on Escape */
    useEffect(() => {
        if (!isOpen) return;

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("keydown", handleKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="notifications-panel-overlay">
            <div className="notifications-panel" ref={panelRef}>
                <div className="notifications-panel-header">
                    <div>
                        <h2 className="notifications-panel-title">Notifications</h2>
                        <p className="notifications-panel-subtitle">
                            Latest updates
                        </p>
                    </div>

                    <button
                        type="button"
                        className="icon-button notifications-panel-close"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                {errorMessage && <p className="form-error">{errorMessage}</p>}

                <div className="notifications-panel-content">
                    <NotificationsList
                        notifications={limitedNotifications}
                        isLoading={isLoading}
                        onUpdated={handleUpdated}
                    />
                </div>

                <div className="notifications-panel-footer">
                    <button
                        className="primary-button"
                        onClick={() => {
                            onClose();
                            navigate("/notifications");
                        }}
                    >
                        View All Notifications
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotificationsPanel;