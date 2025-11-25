import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, User, Users, Save, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import api from "@/api";
import Loader from "@/components/shared/loader";

export default function RoommateMatchingPage() {
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState<"personality" | "preferences">("personality");

    // Step 1: User's own personality data
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
        openForRoommateMatching: false,
    });
    const [isEditingPersonality, setIsEditingPersonality] = useState(true);
    const [isSavingPersonality, setIsSavingPersonality] = useState(false);
    const [hasPersonality, setHasPersonality] = useState(false);

    // Step 2: Preferred roommate data
    const [preferredData, setPreferredData] = useState({
        ageMin: 18,
        ageMax: 30,
        priceMin: 0 as number | string,
        priceMax: 10000 as number | string,
        gender: "Any" as string,
        nationality: "",
        sleepType: "Any" as string,
        cleanliness: "Moderate" as string,
        mbti: "Any" as string,
        smoking: false,
        pets: false,
        noiseTolerance: "Medium" as string,
        temperature: "Flexible" as string,
        additionalPreferences: "",
    });
    const [isEditingPreferred, setIsEditingPreferred] = useState(true);
    const [isSavingPreferred, setIsSavingPreferred] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth/sign-in');
        }

        if (user) {
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
                        openForRoommateMatching: personality.openForRoommateMatching || false,
                    });
                    setHasPersonality(true);
                    setIsEditingPersonality(false);
                } catch (error) {
                    console.log("No existing personality data");
                    setHasPersonality(false);
                    setIsEditingPersonality(true);
                }
            };

            // Fetch preferred roommate data
            const fetchPreferredRoommate = async () => {
                try {
                    const response = await api.get(`/preferred_roommate?userId=${user._id || user.id}`);
                    const pref = response.data;

                    setPreferredData({
                        ageMin: pref.preferred_age_range?.min || 18,
                        ageMax: pref.preferred_age_range?.max || 30,
                        priceMin: pref.preferred_price_range?.min || 0,
                        priceMax: pref.preferred_price_range?.max || 10000,
                        gender: pref.preferred_gender || "Any",
                        nationality: pref.preferred_nationality || "",
                        sleepType: pref.preferred_sleep_type || "Any",
                        cleanliness: pref.preferred_cleanliness || "Moderate",
                        mbti: pref.preferred_MBTI || "Any",
                        smoking: pref.preferred_smoking || false,
                        pets: pref.preferred_pets || false,
                        noiseTolerance: pref.preferred_noise_tolerance || "Medium",
                        temperature: pref.preferred_temperature || "Flexible",
                        additionalPreferences: pref.additional_preferences || "",
                    });
                    setIsEditingPreferred(false);
                } catch (error) {
                    console.log("No existing preferred roommate data");
                    setIsEditingPreferred(true);
                }
            };

            fetchPersonalityData();
            fetchPreferredRoommate();
        }
    }, [user, isLoading, navigate]);

    const handlePersonalitySave = async () => {
        if (!user) return;

        try {
            setIsSavingPersonality(true);

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

            try {
                const existingResponse = await api.get(`/personalities?userId=${user._id || user.id}`);
                await api.put(`/personalities/${existingResponse.data._id}`, backendData);
                toast.success("Personality profile updated successfully!");
            } catch (error: any) {
                await api.post("/personalities", backendData);
                toast.success("Personality profile created successfully!");
            }

            setHasPersonality(true);
            setIsEditingPersonality(false);
            setCurrentStep("preferences");
        } catch (error: any) {
            console.error("Error saving personality:", error);
            toast.error(error.response?.data?.error || "Failed to save personality profile");
        } finally {
            setIsSavingPersonality(false);
        }
    };

    const handlePreferredSave = async () => {
        if (!user) {
            toast.error("Please login to save your roommate preferences");
            navigate("/auth/sign-in");
            return;
        }

        try {
            setIsSavingPreferred(true);

            const preferredRoommateData = {
                userId: user._id || user.id,
                preferred_age_range: {
                    min: preferredData.ageMin,
                    max: preferredData.ageMax,
                },
                preferred_price_range: {
                    min: preferredData.priceMin === "" ? 0 : Number(preferredData.priceMin),
                    max: preferredData.priceMax === "" ? 10000 : Number(preferredData.priceMax),
                },
                preferred_gender: preferredData.gender,
                preferred_nationality: preferredData.nationality || null,
                preferred_sleep_type: preferredData.sleepType,
                preferred_cleanliness: preferredData.cleanliness,
                preferred_MBTI: preferredData.mbti,
                preferred_smoking: preferredData.smoking,
                preferred_pets: preferredData.pets,
                preferred_noise_tolerance: preferredData.noiseTolerance,
                preferred_temperature: preferredData.temperature,
                additional_preferences: preferredData.additionalPreferences || null,
            };

            try {
                const existingResponse = await api.get(`/preferred_roommate?userId=${user._id || user.id}`);
                await api.put(`/preferred_roommate/${existingResponse.data._id}`, preferredRoommateData);
                toast.success("Roommate preferences updated successfully!");
            } catch (error: any) {
                await api.post("/preferred_roommate", preferredRoommateData);
                toast.success("Roommate preferences saved successfully!");
            }

            navigate('/roommates');
        } catch (error: any) {
            console.error("Error saving preferences:", error);
            toast.error(error.response?.data?.error || "Failed to save roommate preferences");
        } finally {
            setIsSavingPreferred(false);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    if (!user) {
        return null;
    }

    return (
        <section className="min-h-screen bg-background px-4 sm:px-6 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                        Find Your Perfect Roommate
                    </h1>
                    <p className="text-muted-foreground">
                        Complete your profile and set your preferences to get matched with compatible roommates
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="mb-8 flex items-center justify-center gap-4">
                    <div className={`flex items-center gap-2 ${currentStep === "personality" ? "text-primary" : hasPersonality ? "text-green-600" : "text-muted-foreground"}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "personality" ? "bg-primary text-white" : hasPersonality ? "bg-green-600 text-white" : "bg-muted"}`}>
                            {hasPersonality ? "✓" : "1"}
                        </div>
                        <span className="font-semibold hidden sm:inline">Your Personality</span>
                    </div>
                    <ChevronRight className="text-muted-foreground" />
                    <div className={`flex items-center gap-2 ${currentStep === "preferences" ? "text-primary" : "text-muted-foreground"}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "preferences" ? "bg-primary text-white" : "bg-muted"}`}>
                            2
                        </div>
                        <span className="font-semibold hidden sm:inline">Roommate Preferences</span>
                    </div>
                </div>

                <Tabs value={currentStep} onValueChange={(val) => setCurrentStep(val as "personality" | "preferences")} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 h-auto p-1">
                        <TabsTrigger value="personality" className="py-3">
                            <User className="w-4 h-4 mr-2" />
                            Your Personality
                        </TabsTrigger>
                        <TabsTrigger value="preferences" className="py-3">
                            <Users className="w-4 h-4 mr-2" />
                            Preferences
                        </TabsTrigger>
                    </TabsList>

                    {/* Step 1: Your Personality */}
                    <TabsContent value="personality" className="space-y-6">
                        <Card className="border-2 border-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Your Personality Profile</CardTitle>
                                    <CardDescription>
                                        Tell us about yourself so we can find you the best match
                                    </CardDescription>
                                </div>
                                {hasPersonality && !isEditingPersonality && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditingPersonality(true)}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                )}
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
                                        <Label htmlFor="p-description">About Me</Label>
                                        <Textarea
                                            id="p-description"
                                            value={personalityData.description}
                                            onChange={(e) => setPersonalityData({ ...personalityData, description: e.target.value })}
                                            disabled={!isEditingPersonality}
                                            className="bg-muted/50"
                                            placeholder="Tell us about yourself"
                                            rows={3}
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
                                                    <SelectItem value="Cold">Cold</SelectItem>
                                                    <SelectItem value="Cool">Cool</SelectItem>
                                                    <SelectItem value="Warm">Warm</SelectItem>
                                                    <SelectItem value="Hot">Hot</SelectItem>
                                                    <SelectItem value="Flexible">Flexible</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {isEditingPersonality && (
                                    <div className="flex justify-end gap-3 pt-4">
                                        {hasPersonality && (
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsEditingPersonality(false)}
                                                disabled={isSavingPersonality}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        <Button
                                            onClick={handlePersonalitySave}
                                            className="rounded-full bg-gradient text-white"
                                            disabled={isSavingPersonality}
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isSavingPersonality ? "Saving..." : "Save & Continue"}
                                        </Button>
                                    </div>
                                )}

                                {!isEditingPersonality && hasPersonality && (
                                    <div className="flex justify-end pt-4">
                                        <Button
                                            onClick={() => setCurrentStep("preferences")}
                                            className="rounded-full bg-gradient text-white"
                                        >
                                            Continue to Preferences
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Step 2: Preferred Roommate */}
                    <TabsContent value="preferences" className="space-y-6">
                        <Card className="border-2 border-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Preferred Roommate Criteria</CardTitle>
                                    <CardDescription>
                                        Set your preferences to help us find your ideal roommate
                                    </CardDescription>
                                </div>
                                {!isEditingPreferred && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditingPreferred(true)}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Preferred Age Range */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Preferred Age Range</h3>
                                    <Separator />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="ageMin">Minimum Age</Label>
                                            <Input
                                                id="ageMin"
                                                type="number"
                                                value={preferredData.ageMin}
                                                onChange={(e) => setPreferredData({ ...preferredData, ageMin: parseInt(e.target.value) || 18 })}
                                                disabled={!isEditingPreferred}
                                                className="bg-muted/50"
                                                min="16"
                                                max="100"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ageMax">Maximum Age</Label>
                                            <Input
                                                id="ageMax"
                                                type="number"
                                                value={preferredData.ageMax}
                                                onChange={(e) => setPreferredData({ ...preferredData, ageMax: parseInt(e.target.value) || 30 })}
                                                disabled={!isEditingPreferred}
                                                className="bg-muted/50"
                                                min="16"
                                                max="100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Preferred Price Range */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Preferred Price Range (Monthly)</h3>
                                    <Separator />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="priceMin">Minimum Price (฿)</Label>
                                            <Input
                                                id="priceMin"
                                                type="number"
                                                value={preferredData.priceMin}
                                                onChange={(e) => setPreferredData({ ...preferredData, priceMin: e.target.value === "" ? "" : parseInt(e.target.value) })}
                                                disabled={!isEditingPreferred}
                                                className="bg-muted/50"
                                                min="0"
                                                step="100"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="priceMax">Maximum Price (฿)</Label>
                                            <Input
                                                id="priceMax"
                                                type="number"
                                                value={preferredData.priceMax}
                                                onChange={(e) => setPreferredData({ ...preferredData, priceMax: e.target.value === "" ? "" : parseInt(e.target.value) })}
                                                disabled={!isEditingPreferred}
                                                className="bg-muted/50"
                                                min="0"
                                                step="100"
                                                placeholder="10000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Preferred Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Preferred Basic Information</h3>
                                    <Separator />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pref-gender">Preferred Gender</Label>
                                            <Select
                                                value={preferredData.gender}
                                                onValueChange={(value) => setPreferredData({ ...preferredData, gender: value })}
                                                disabled={!isEditingPreferred}
                                            >
                                                <SelectTrigger className="bg-muted/50">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                                                    <SelectItem value="Any">Any</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pref-nationality">Preferred Nationality (Optional)</Label>
                                            <Input
                                                id="pref-nationality"
                                                value={preferredData.nationality}
                                                onChange={(e) => setPreferredData({ ...preferredData, nationality: e.target.value })}
                                                disabled={!isEditingPreferred}
                                                className="bg-muted/50"
                                                placeholder="Any nationality"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Preferred Lifestyle */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Preferred Lifestyle</h3>
                                    <Separator />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pref-sleepType">Sleep Type</Label>
                                            <Select
                                                value={preferredData.sleepType}
                                                onValueChange={(value) => setPreferredData({ ...preferredData, sleepType: value })}
                                                disabled={!isEditingPreferred}
                                            >
                                                <SelectTrigger className="bg-muted/50">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Early Bird">Early Bird</SelectItem>
                                                    <SelectItem value="Night Owl">Night Owl</SelectItem>
                                                    <SelectItem value="Any">Any</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pref-cleanliness">Cleanliness</Label>
                                            <Select
                                                value={preferredData.cleanliness}
                                                onValueChange={(value) => setPreferredData({ ...preferredData, cleanliness: value })}
                                                disabled={!isEditingPreferred}
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

                                {/* Preferred Personality */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Preferred Personality</h3>
                                    <Separator />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pref-mbti">MBTI</Label>
                                            <Select
                                                value={preferredData.mbti}
                                                onValueChange={(value) => setPreferredData({ ...preferredData, mbti: value })}
                                                disabled={!isEditingPreferred}
                                            >
                                                <SelectTrigger className="bg-muted/50">
                                                    <SelectValue />
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
                                                    <SelectItem value="Any">Any</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Preferred Habits */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Preferred Habits</h3>
                                    <Separator />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pref-smoking">Smoking</Label>
                                            <Select
                                                value={preferredData.smoking ? "Yes" : "No"}
                                                onValueChange={(value) => setPreferredData({ ...preferredData, smoking: value === "Yes" })}
                                                disabled={!isEditingPreferred}
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
                                            <Label htmlFor="pref-pets">Pets</Label>
                                            <Select
                                                value={preferredData.pets ? "Yes" : "No"}
                                                onValueChange={(value) => setPreferredData({ ...preferredData, pets: value === "Yes" })}
                                                disabled={!isEditingPreferred}
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
                                    </div>
                                </div>

                                {/* Environmental Preferences */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Environmental Preferences</h3>
                                    <Separator />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pref-noiseTolerance">Noise Tolerance</Label>
                                            <Select
                                                value={preferredData.noiseTolerance}
                                                onValueChange={(value) => setPreferredData({ ...preferredData, noiseTolerance: value })}
                                                disabled={!isEditingPreferred}
                                            >
                                                <SelectTrigger className="bg-muted/50">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Low">Low</SelectItem>
                                                    <SelectItem value="Medium">Medium</SelectItem>
                                                    <SelectItem value="High">High</SelectItem>
                                                    <SelectItem value="Flexible">Flexible</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pref-temperature">Temperature Preference</Label>
                                            <Select
                                                value={preferredData.temperature}
                                                onValueChange={(value) => setPreferredData({ ...preferredData, temperature: value })}
                                                disabled={!isEditingPreferred}
                                            >
                                                <SelectTrigger className="bg-muted/50">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Cold">Cold</SelectItem>
                                                    <SelectItem value="Cool">Cool</SelectItem>
                                                    <SelectItem value="Warm">Warm</SelectItem>
                                                    <SelectItem value="Hot">Hot</SelectItem>
                                                    <SelectItem value="Flexible">Flexible</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Preferences */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Additional Preferences</h3>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label htmlFor="additionalPreferences">Any other preferences?</Label>
                                        <Textarea
                                            id="additionalPreferences"
                                            value={preferredData.additionalPreferences}
                                            onChange={(e) => setPreferredData({ ...preferredData, additionalPreferences: e.target.value })}
                                            disabled={!isEditingPreferred}
                                            className="bg-muted/50"
                                            placeholder="Tell us anything else you'd like in a roommate..."
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    {isEditingPreferred && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentStep("personality")}
                                        >
                                            Back
                                        </Button>
                                    )}
                                    {!isEditingPreferred && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditingPreferred(true)}
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Preferences
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handlePreferredSave}
                                        className="rounded-full bg-gradient text-white"
                                        disabled={isSavingPreferred}
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        {isSavingPreferred ? "Saving..." : "Save & Find Matches"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}