import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bell,
    Calendar,
    Camera,
    Edit,
    Eye,
    LogOut,
    MapPin,
    Palette,
    Phone,
    Save,
    Shield,
    User
} from "lucide-react";
import { useState } from "react";

export default function MyAccountPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: "Viviana",
        email: "6531503187@lamduan.mfu.ac.th",
        phone: "+66 89 123 4567",
        dateOfBirth: "2002-12-19",
        address: "Mae Fah Luang University, Chiang Rai",
        bio: "Software Engineering student passionate about full-stack development and AI."
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        weeklyDigest: true
    });

    const handleSave = () => {
        setIsEditing(false);
        // Save logic here
    };

    return (
        <section className="min-h-screen bg-background px-4 sm:px-6 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                        My Account
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your profile and account settings
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Sidebar - Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="border-2 border-border sticky top-6">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    {/* Avatar with upload button */}
                                    <div className="relative mb-4">
                                        <Avatar className="w-32 h-32 border-4 border-border">
                                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Steven" />
                                            <AvatarFallback className="text-2xl">SA</AvatarFallback>
                                        </Avatar>
                                        <Button
                                            size="icon"
                                            className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
                                        >
                                            <Camera className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <h2 className="text-2xl font-bold text-foreground mb-1">
                                        {profileData.fullName}
                                    </h2>
                                    <p className="text-muted-foreground text-sm mb-3">
                                        {profileData.email}
                                    </p>

                                    <Badge className="mb-4 bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                                        Active Account
                                    </Badge>

                                    <Separator className="my-4" />

                                    <div className="w-full space-y-3 text-left">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">{profileData.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground line-clamp-2">{profileData.address}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">{profileData.dateOfBirth}</span>
                                        </div>
                                    </div>

                                    <Separator className="my-4" />

                                    <Button
                                        variant="outline"
                                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Content - Tabs */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="profile" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                                <TabsTrigger value="profile" className="py-3">
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="security" className="py-3">
                                    <Shield className="w-4 h-4 mr-2" />
                                    Security
                                </TabsTrigger>
                                <TabsTrigger value="preferences" className="py-3">
                                    <Palette className="w-4 h-4 mr-2" />
                                    Preferences
                                </TabsTrigger>
                            </TabsList>

                            {/* Profile Tab */}
                            <TabsContent value="profile" className="space-y-6">
                                <Card className="border-2 border-border">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Personal Information</CardTitle>
                                            <CardDescription>
                                                Update your personal details and information
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditing(!isEditing)}
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            {isEditing ? "Cancel" : "Edit"}
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName">Full Name</Label>
                                                <Input
                                                    id="fullName"
                                                    value={profileData.fullName}
                                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="bg-muted/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="bg-muted/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="bg-muted/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dob">Date of Birth</Label>
                                                <Input
                                                    id="dob"
                                                    type="date"
                                                    value={profileData.dateOfBirth}
                                                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="bg-muted/50"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                value={profileData.address}
                                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                                disabled={!isEditing}
                                                className="bg-muted/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Input
                                                id="bio"
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                disabled={!isEditing}
                                                className="bg-muted/50"
                                            />
                                        </div>

                                        {isEditing && (
                                            <div className="flex justify-end gap-3 pt-4">
                                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleSave} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Security Tab */}
                            <TabsContent value="security" className="space-y-6">
                                <Card className="border-2 border-border">
                                    <CardHeader>
                                        <CardTitle>Change Password</CardTitle>
                                        <CardDescription>
                                            Update your password to keep your account secure
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <Input
                                                id="currentPassword"
                                                type="password"
                                                placeholder="Enter current password"
                                                className="bg-muted/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                placeholder="Enter new password"
                                                className="bg-muted/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Confirm new password"
                                                className="bg-muted/50"
                                            />
                                        </div>
                                        <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                                            Update Password
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 border-border">
                                    <CardHeader>
                                        <CardTitle>Two-Factor Authentication</CardTitle>
                                        <CardDescription>
                                            Add an extra layer of security to your account
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="font-medium text-foreground">Enable 2FA</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Protect your account with two-factor authentication
                                                </p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Preferences Tab */}
                            <TabsContent value="preferences" className="space-y-6">
                                <Card className="border-2 border-border">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Bell className="w-5 h-5 text-primary" />
                                            <CardTitle>Notifications</CardTitle>
                                        </div>
                                        <CardDescription>
                                            Manage how you receive notifications
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
                                            Customize how the app looks for you
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Theme</Label>
                                            <Select defaultValue="system">
                                                <SelectTrigger className="bg-muted/50">
                                                    <SelectValue placeholder="Select theme" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="light">Light</SelectItem>
                                                    <SelectItem value="dark">Dark</SelectItem>
                                                    <SelectItem value="system">System</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Language</Label>
                                            <Select defaultValue="en">
                                                <SelectTrigger className="bg-muted/50">
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="th">ไทย (Thai)</SelectItem>
                                                    <SelectItem value="zh">中文 (Chinese)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </section>
    );
}