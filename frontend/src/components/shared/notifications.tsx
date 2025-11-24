import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
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

interface NotificationItem {
    _id: number;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: string;
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const unreadCount = notifications.filter((n) => !n.read).length;

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            const data = res.data.map((n: any) => ({
                _id: n._id,
                title: n.title,
                description: n.message,
                time: new Date(n.createdAt).toLocaleString(),
                read: n.read,
                type: n.type,
            }));
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await Promise.all(
                notifications
                    .filter((n) => !n.read)
                    .map((n) => api.put(`/notifications/${n._id}/read`))
            );
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
                                        "flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50",
                                        !notification.read && "bg-muted/30"
                                    )}
                                    onClick={() => markAsRead(notification._id)}
                                >
                                    <div className="flex w-full items-start justify-between gap-2">
                                        <span className={cn("text-sm font-semibold leading-none", !notification.read && "text-primary")}>
                                            {notification.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {notification.time}
                                        </span>
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
                <DropdownMenuSeparator />
                <div className="p-2">
                    <Button variant="outline" className="w-full h-8 text-xs" asChild>
                        <a href="/notifications">View all notifications</a>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
