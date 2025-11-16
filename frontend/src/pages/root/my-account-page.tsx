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
    User,
    UserCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import Loader from "@/components/shared/loader";
import api from "@/api";

export default function MyAccountPage() {
    const { user, logout, isLoading, setUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        address: "",
        bio: ""
    });
    const [personalityData, setPersonalityData] = useState({
        nickname: "",
        age: 18,
        gender: "Prefer not to say" as string,
        nationality: "",
        description: "",
        contact: "",
        sleepSchedule: "Flexible" as string,
        lifestyle: "Moderate" as string,
        studyHabits: "some_noise" as string,
        cleanliness: "Moderate" as string,
        social: "Moderate" as string,
        mbti: "" as string,
        goingOut: "Occasional" as string,
        smoking: false,
        drinking: "Never" as string,
        pets: "Flexible" as string,
        noiseTolerance: "Medium" as string,
        temperature: "Flexible" as string,
    });
    const [isEditingPersonality, setIsEditingPersonality] = useState(false);
    const [isSavingPersonality, setIsSavingPersonality] = useState(false);

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        weeklyDigest: true
    });

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth/sign-in');
        }
        
        if (user) {
            // Fetch full user data from backend to get all fields
            const fetchUserData = async () => {
                try {
                    const response = await api.get(`/users/${user._id || user.id}`);
                    const userData = response.data;
                    setProfileData({
                        fullName: userData.name || "",
                        email: userData.email || "",
                        phone: userData.phone || "",
                        dateOfBirth: userData.dateOfBirth || "",
                        address: userData.address || "",
                        bio: userData.bio || ""
                    });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    // Fallback to user from context
                    setProfileData({
                        fullName: user.name || "",
                        email: user.email || "",
                        phone: "",
                        dateOfBirth: "",
                        address: "",
                        bio: ""
                    });
                }
            };
            
            fetchUserData();
            
            // Fetch personality data
            const fetchPersonalityData = async () => {
                try {
                    const response = await api.get(`/personalities?userId=${user._id || user.id}`);
                    const personality = response.data;
                    setPersonalityData({
                        nickname: personality.nickname || "",
                        age: personality.age || 18,
                        gender: personality.gender || "Prefer not to say",
                        nationality: personality.nationality || "",
                        description: personality.description || "",
                        contact: personality.contact || "",
                        sleepSchedule: personality.sleep_type || "Flexible",
                        lifestyle: personality.lifestyle?.[0] || "Moderate",
                        studyHabits: personality.study_habits || "some_noise",
                        cleanliness: personality.cleanliness || "Moderate",
                        social: personality.social || "Moderate",
                        mbti: personality.MBTI || "",
                        goingOut: personality.going_out || "Occasional",
                        smoking: personality.smoking || false,
                        drinking: personality.drinking || "Never",
                        pets: personality.pets || "Flexible",
                        noiseTolerance: personality.noise_tolerance || "Medium",
                        temperature: personality.temperature || "Flexible",
                    });
                } catch (error) {
                    console.log("No existing personality data");
                }
            };
            
            fetchPersonalityData();
        }
    }, [user, isLoading, navigate]);

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate('/');
    };

    const handlePersonalitySave = async () => {
        if (!user) return;
        
        try {
            setIsSavingPersonality(true);
            
            // Map frontend form data to backend schema
            const backendData = {
                userId: user._id || user.id,
                nickname: personalityData.nickname || user.name,
                age: personalityData.age,
                gender: personalityData.gender,
                nationality: personalityData.nationality,
                description: personalityData.description || null,
                contact: personalityData.contact,
                sleep_schedule: null,
                lifestyle: [personalityData.lifestyle],
                sleep_type: personalityData.sleepSchedule,
                study_habits: personalityData.studyHabits,
                cleanliness: personalityData.cleanliness,
                social: personalityData.social,
                MBTI: personalityData.mbti || null,
                going_out: personalityData.goingOut,
                smoking: personalityData.smoking,
                drinking: personalityData.drinking,
                pets: personalityData.pets,
                noise_tolerance: personalityData.noiseTolerance,
                temperature: personalityData.temperature,
            };

            // Check if personality already exists
            try {
                const existingResponse = await api.get(`/personalities?userId=${user._id || user.id}`);
                // Update existing personality
                await api.put(`/personalities/${existingResponse.data._id}`, backendData);
                toast.success("Personality profile updated successfully!");
            } catch (error: any) {
                // Create new personality
                await api.post("/personalities", backendData);
                toast.success("Personality profile created successfully!");
            }
            
            setIsEditingPersonality(false);
        } catch (error: any) {
            console.error("Error saving personality:", error);
            toast.error(error.response?.data?.error || "Failed to save personality profile");
        } finally {
            setIsSavingPersonality(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        
        try {
            setIsSaving(true);
            
            // Update user profile via API with all fields
            const response = await api.put(`/users/${user._id || user.id}`, {
                name: profileData.fullName,
                email: profileData.email,
                phone: profileData.phone,
                dateOfBirth: profileData.dateOfBirth,
                address: profileData.address,
                bio: profileData.bio
            });
            
            // Update the user context with new data
            if (setUser) {
                setUser({
                    ...user,
                    name: response.data.name,
                    email: response.data.email,
                    _id: response.data._id
                });
            }
            
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.error || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    if (!user) {
        return null;
    }

    const userInitials = user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

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
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                            <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                                        </Avatar>
                                        <Button
                                            size="icon"
                                            className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
                                        >
                                            <Camera className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <h2 className="text-2xl font-bold text-foreground mb-1">
                                        {user.name}
                                    </h2>
                                    <p className="text-muted-foreground text-sm mb-3">
                                        {user.email}
                                    </p>

                                    <Badge className="mb-4 bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                                        {user.role === 'student' ? 'Student' : user.role === 'admin' ? 'Admin' : 'Owner'}
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
                                        onClick={handleLogout}
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
                            <TabsList className="grid w-full grid-cols-4 h-auto p-1">
                                <TabsTrigger value="profile" className="py-3">
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="personalities" className="py-3">
                                    <UserCircle className="w-4 h-4 mr-2" />
                                    Personalities
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
                                                <Button 
                                                    variant="outline" 
                                                    onClick={() => setIsEditing(false)}
                                                    disabled={isSaving}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button 
                                                    onClick={handleSave} 
                                                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                                    disabled={isSaving}
                                                >
                                                    <Save className="w-4 h-4 mr-2" />
                                                    {isSaving ? "Saving..." : "Save Changes"}
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Personalities Tab */}
                            <TabsContent value="personalities" className="space-y-6">
                                <Card className="border-2 border-border">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Personality Profile</CardTitle>
                                            <CardDescription>
                                                Share your personality and lifestyle preferences
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditingPersonality(!isEditingPersonality)}
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            {isEditingPersonality ? "Cancel" : "Edit"}
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Basic Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                                            <Separator />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="nickname">Nickname</Label>
                                                    <Input
                                                        id="nickname"
                                                        value={personalityData.nickname}
                                                        onChange={(e) => setPersonalityData({ ...personalityData, nickname: e.target.value })}
                                                        disabled={!isEditingPersonality}
                                                        className="bg-muted/50"
                                                        placeholder="Your preferred name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="age">Age</Label>
                                                    <Input
                                                        id="age"
                                                        type="number"
                                                        value={personalityData.age}
                                                        onChange={(e) => setPersonalityData({ ...personalityData, age: parseInt(e.target.value) || 18 })}
                                                        disabled={!isEditingPersonality}
                                                        className="bg-muted/50"
                                                        min="16"
                                                        max="100"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="p-gender">Gender</Label>
                                                    <Select
                                                        value={personalityData.gender}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, gender: value })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Male">Male</SelectItem>
                                                            <SelectItem value="Female">Female</SelectItem>
                                                            <SelectItem value="Non-binary">Non-binary</SelectItem>
                                                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="p-nationality">Nationality</Label>
                                                    <Input
                                                        id="p-nationality"
                                                        value={personalityData.nationality}
                                                        onChange={(e) => setPersonalityData({ ...personalityData, nationality: e.target.value })}
                                                        disabled={!isEditingPersonality}
                                                        className="bg-muted/50"
                                                        placeholder="Your nationality"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="p-contact">Contact</Label>
                                                <Input
                                                    id="p-contact"
                                                    value={personalityData.contact}
                                                    onChange={(e) => setPersonalityData({ ...personalityData, contact: e.target.value })}
                                                    disabled={!isEditingPersonality}
                                                    className="bg-muted/50"
                                                    placeholder="Phone or email"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="p-description">Description</Label>
                                                <Input
                                                    id="p-description"
                                                    value={personalityData.description}
                                                    onChange={(e) => setPersonalityData({ ...personalityData, description: e.target.value })}
                                                    disabled={!isEditingPersonality}
                                                    className="bg-muted/50"
                                                    placeholder="Tell us about yourself"
                                                />
                                            </div>
                                        </div>

                                        {/* Lifestyle Preferences */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Lifestyle Preferences</h3>
                                            <Separator />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="sleepSchedule">Sleep Schedule</Label>
                                                    <Select
                                                        value={personalityData.sleepSchedule}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, sleepSchedule: value })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Early Bird">Early Bird</SelectItem>
                                                            <SelectItem value="Night Owl">Night Owl</SelectItem>
                                                            <SelectItem value="Flexible">Flexible</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lifestyle">Lifestyle</Label>
                                                    <Select
                                                        value={personalityData.lifestyle}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, lifestyle: value })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Active">Active</SelectItem>
                                                            <SelectItem value="Moderate">Moderate</SelectItem>
                                                            <SelectItem value="Relaxed">Relaxed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="studyHabits">Study Habits</Label>
                                                    <Select
                                                        value={personalityData.studyHabits}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, studyHabits: value })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="silent">Silent</SelectItem>
                                                            <SelectItem value="some_noise">Some Noise</SelectItem>
                                                            <SelectItem value="flexible">Flexible</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cleanliness">Cleanliness</Label>
                                                    <Select
                                                        value={personalityData.cleanliness}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, cleanliness: value })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Tidy">Tidy</SelectItem>
                                                            <SelectItem value="Moderate">Moderate</SelectItem>
                                                            <SelectItem value="Messy">Messy</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Social Preferences */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Social Preferences</h3>
                                            <Separator />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="social">Social Level</Label>
                                                    <Select
                                                        value={personalityData.social}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, social: value })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Social">Social</SelectItem>
                                                            <SelectItem value="Moderate">Moderate</SelectItem>
                                                            <SelectItem value="Quiet">Quiet</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="mbti">MBTI (Optional)</Label>
                                                    <Select
                                                        value={personalityData.mbti}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, mbti: value })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue placeholder="Select MBTI" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="INTJ">INTJ</SelectItem>
                                                            <SelectItem value="INTP">INTP</SelectItem>
                                                            <SelectItem value="ENTJ">ENTJ</SelectItem>
                                                            <SelectItem value="ENTP">ENTP</SelectItem>
                                                            <SelectItem value="INFJ">INFJ</SelectItem>
                                                            <SelectItem value="INFP">INFP</SelectItem>
                                                            <SelectItem value="ENFJ">ENFJ</SelectItem>
                                                            <SelectItem value="ENFP">ENFP</SelectItem>
                                                            <SelectItem value="ISTJ">ISTJ</SelectItem>
                                                            <SelectItem value="ISFJ">ISFJ</SelectItem>
                                                            <SelectItem value="ESTJ">ESTJ</SelectItem>
                                                            <SelectItem value="ESFJ">ESFJ</SelectItem>
                                                            <SelectItem value="ISTP">ISTP</SelectItem>
                                                            <SelectItem value="ISFP">ISFP</SelectItem>
                                                            <SelectItem value="ESTP">ESTP</SelectItem>
                                                            <SelectItem value="ESFP">ESFP</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="goingOut">Going Out</Label>
                                                    <Select
                                                        value={personalityData.goingOut}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, goingOut: value })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Frequent">Frequent</SelectItem>
                                                            <SelectItem value="Occasional">Occasional</SelectItem>
                                                            <SelectItem value="Homebody">Homebody</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Habits */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Habits</h3>
                                            <Separator />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="smoking">Smoking</Label>
                                                    <Select
                                                        value={personalityData.smoking ? "Yes" : "No"}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, smoking: value === "Yes" })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Yes">Yes</SelectItem>
                                                            <SelectItem value="No">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="drinking">Drinking</Label>
                                                    <Select
                                                        value={personalityData.drinking}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, drinking: value })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Never">Never</SelectItem>
                                                            <SelectItem value="Occasional">Occasional</SelectItem>
                                                            <SelectItem value="Frequent">Frequent</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="pets">Pets</Label>
                                                    <Select
                                                        value={personalityData.pets}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, pets: value })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Pet Owner">Pet Owner</SelectItem>
                                                            <SelectItem value="Allergic">Allergic</SelectItem>
                                                            <SelectItem value="Dog Person">Dog Person</SelectItem>
                                                            <SelectItem value="Cat Person">Cat Person</SelectItem>
                                                            <SelectItem value="Flexible">Flexible</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Environmental Preferences */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Environmental Preferences</h3>
                                            <Separator />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="noiseTolerance">Noise Tolerance</Label>
                                                    <Select
                                                        value={personalityData.noiseTolerance}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, noiseTolerance: value })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="High">High</SelectItem>
                                                            <SelectItem value="Medium">Medium</SelectItem>
                                                            <SelectItem value="Low">Low</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="temperature">Temperature Preference</Label>
                                                    <Select
                                                        value={personalityData.temperature}
                                                        onValueChange={(value) => setPersonalityData({ ...personalityData, temperature: value })}
                                                        disabled={!isEditingPersonality}
                                                    >
                                                        <SelectTrigger className="bg-muted/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Warm">Warm</SelectItem>
                                                            <SelectItem value="Cool">Cool</SelectItem>
                                                            <SelectItem value="Flexible">Flexible</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        {isEditingPersonality && (
                                            <div className="flex justify-end gap-3 pt-4">
                                                <Button 
                                                    variant="outline" 
                                                    onClick={() => setIsEditingPersonality(false)}
                                                    disabled={isSavingPersonality}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button 
                                                    onClick={handlePersonalitySave} 
                                                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                                    disabled={isSavingPersonality}
                                                >
                                                    <Save className="w-4 h-4 mr-2" />
                                                    {isSavingPersonality ? "Saving..." : "Save Changes"}
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