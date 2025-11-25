import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import api from "@/api";
import { useNavigate } from "react-router";

interface NotificationItem {
    _id: number;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: string;
    data?: {
        senderId?: number;
        conversationId?: number;
        messageId?: number;
        knockId?: number;
        accepterId?: number;
    };
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const navigate = useNavigate();
    const unreadCount = notifications.filter((n) => !n.read).length;

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            console.log("📬 Raw notifications from backend:", res.data);
            const data = res.data.map((n: any) => {
                console.log("Mapping notification:", {
                    _id: n._id,
                    title: n.title,
                    type: n.type,
                    read: n.read
                });
                return {
                    _id: n._id || n.id, // Fallback to id if _id is missing
                    title: n.title,
                    description: n.message,
                    time: new Date(n.createdAt).toLocaleString(),
                    read: n.read,
                    type: n.type,
                    data: n.data, // Include data field for navigation
                };
            });
            console.log("📬 Mapped notifications:", data);
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 3 seconds for near real-time updates
        const interval = setInterval(fetchNotifications, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleNotificationClick = async (notification: NotificationItem) => {
        console.log("🔔 Notification clicked:", notification);

        if (!notification._id) {
            console.error("❌ Notification has no _id:", notification);
            return;
        }

        // Mark as read first
        try {
            console.log(`📝 Marking notification ${notification._id} as read...`);
            await api.put(`/notifications/${notification._id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
            );
            console.log(`✅ Notification ${notification._id} marked as read`);
        } catch (error) {
            console.error("Failed to mark as read", error);
        }

        // Small delay to ensure UI updates before navigation
        await new Promise(resolve => setTimeout(resolve, 100));

        // Navigate based on notification type
        if (notification.type === "knock") {
            navigate("/knockknock");
        } else if (notification.type === "message") {
            // Navigate to connection page with the sender
            const senderId = notification.data?.senderId;
            if (senderId) {
                navigate(`/connection/${senderId}`);
            }
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // Prevent triggering the notification click

        console.log("🗑️ Deleting notification:", id);

        if (!id) {
            console.error("❌ Cannot delete notification with no ID");
            return;
        }

        try {
            await api.delete(`/notifications/${id}`);
            setNotifications((prev) => prev.filter((n) => n._id !== id));
            console.log(`✅ Notification ${id} deleted`);
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    const markAllAsRead = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent dropdown from closing
        e.preventDefault();

        try {
            const unreadNotifications = notifications.filter((n) => !n.read);

            if (unreadNotifications.length === 0) return;

            // Mark all as read in parallel
            await Promise.all(
                unreadNotifications.map((n) => api.put(`/notifications/${n._id}/read`))
            );

            // Update local state
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

            console.log(`✅ Marked ${unreadNotifications.length} notifications as read`);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 md:w-96" align="end">
                <div className="flex items-center justify-between px-4 py-2">
                    <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 text-xs text-muted-foreground hover:text-primary"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <p className="text-sm">No notifications</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification._id}
                                    className={cn(
                                        "flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50 relative group",
                                        !notification.read && "bg-muted/30"
                                    )}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex w-full items-start justify-between gap-2">
                                        <span className={cn("text-sm font-semibold leading-none", !notification.read && "text-primary")}>
                                            {notification.title}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {notification.time}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => handleDelete(e, notification._id)}
                                            >
                                                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {notification.description}
                                    </p>
                                    {!notification.read && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                                                New
                                            </Badge>
                                        </div>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
