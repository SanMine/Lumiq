import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Eye } from "lucide-react";
import { useTheme } from "@/components/shared/theme-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    weeklyDigest: boolean;
}

interface PreferencesTabProps {
    notifications: NotificationSettings;
    setNotifications: (settings: NotificationSettings) => void;
}

export default function PreferencesTab({
    notifications,
    setNotifications
}: PreferencesTabProps) {
    const { theme, setTheme } = useTheme();

    return (
        <div className="space-y-6">
            <Card className="border-2 border-border">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20">
                            In Development
                        </Badge>
                    </div>
                    <CardDescription>
                        Notification features are currently in development. Settings below are not yet functional.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                            </p>
                        </div>
                        <Switch
                            checked={notifications.emailNotifications}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, emailNotifications: checked })
                            }
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">
                                Receive push notifications in browser
                            </p>
                        </div>
                        <Switch
                            checked={notifications.pushNotifications}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, pushNotifications: checked })
                            }
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">SMS Notifications</p>
                            <p className="text-sm text-muted-foreground">
                                Receive notifications via SMS
                            </p>
                        </div>
                        <Switch
                            checked={notifications.smsNotifications}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, smsNotifications: checked })
                            }
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Weekly Digest</p>
                            <p className="text-sm text-muted-foreground">
                                Get weekly summary of activity
                            </p>
                        </div>
                        <Switch
                            checked={notifications.weeklyDigest}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, weeklyDigest: checked })
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-2 border-border">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-primary" />
                        <CardTitle>Appearance</CardTitle>
                    </div>
                    <CardDescription>
                        Choose your preferred theme
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Theme</p>
                            <p className="text-sm text-muted-foreground">
                                Select light, dark, or system theme
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={theme === "light" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTheme("light")}
                            >
                                Light
                            </Button>
                            <Button
                                variant={theme === "dark" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTheme("dark")}
                            >
                                Dark
                            </Button>
                            <Button
                                variant={theme === "system" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTheme("system")}
                            >
                                System
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
