import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Shield, User, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import Loader from "@/components/shared/loader";
import api from "@/api";
import ProfileCard from "@/components/account/profile-card";
import ProfileTab from "@/components/account/profile-tab";
import PersonalitiesTab from "@/components/account/personalities-tab";
import SecurityTab from "@/components/account/security-tab";
import PreferencesTab from "@/components/account/preferences-tab";

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
        openForRoommateMatching: true,
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
                        openForRoommateMatching: personality.openForRoommateMatching ?? true,
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
        navigate('/auth/sign-in');
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
                openForRoommateMatching: personalityData.openForRoommateMatching,
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
                        <ProfileCard
                            user={user}
                            profileData={profileData}
                            userInitials={userInitials}
                            onLogout={handleLogout}
                            onNavigateRoommates={() => navigate('/knockknock')}
                        />
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
                                <ProfileTab
                                    profileData={profileData}
                                    setProfileData={setProfileData}
                                    isEditing={isEditing}
                                    setIsEditing={setIsEditing}
                                    isSaving={isSaving}
                                    handleSave={handleSave}
                                />
                            </TabsContent>

                            {/* Personalities Tab */}
                            <TabsContent value="personalities" className="space-y-6">
                                <PersonalitiesTab
                                    personalityData={personalityData}
                                    setPersonalityData={setPersonalityData}
                                    isEditingPersonality={isEditingPersonality}
                                    setIsEditingPersonality={setIsEditingPersonality}
                                    isSavingPersonality={isSavingPersonality}
                                    handlePersonalitySave={handlePersonalitySave}
                                />
                            </TabsContent>

                            {/* Security Tab */}
                            <TabsContent value="security" className="space-y-6">
                                <SecurityTab />
                            </TabsContent>

                            {/* Preferences Tab */}
                            <TabsContent value="preferences" className="space-y-6">
                                <PreferencesTab
                                    notifications={notifications}
                                    setNotifications={setNotifications}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </section>
    );
}