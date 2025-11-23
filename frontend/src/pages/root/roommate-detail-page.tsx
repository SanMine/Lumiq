import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Info, Mail } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "@/api";
import { toast } from "sonner";
import Spinner from "@/components/shared/spinner";

interface UserProfile {
    _id: number;
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    bio?: string;
}

interface Personality {
    nickname: string;
    age: number;
    gender: string;
    nationality: string;
    description?: string;
    contact?: string;
    sleep_type: string;
    lifestyle: string[];
    study_habits: string;
    cleanliness: string;
    social: string;
    MBTI?: string;
    going_out: string;
    smoking: boolean;
    drinking: string;
    pets: string;
    noise_tolerance: string;
    temperature: string;
}

interface CompatibilityDetails {
    candidateId: number;
    candidateName: string;
    matchPercentage: number;
    compatibility: {
        personalityMatch: string;
        lifestyleMatch: string;
        preferenceMatch: string;
        overallReason: string;
    };
    detailedScores?: {
        yourPreferencesVsTheirPersonality: number;
        yourPersonalityVsTheirPreferences: number;
        breakdown: {
            preferencesMatchDetails: string[];
            personalityMatchDetails: string[];
        };
    };
}

interface Knock {
    _id: string;
    senderId: number;
    recipientId: number;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    updatedAt: string;
}

export default function RoommateDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [roommate, setRoommate] = useState<UserProfile | null>(null);
    const [personality, setPersonality] = useState<Personality | null>(null);
    const [compatibility, setCompatibility] = useState<CompatibilityDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Knock-related state
    const [knock, setKnock] = useState<Knock | null>(null);
    const [knockLoading, setKnockLoading] = useState(false);
    const [allKnocks, setAllKnocks] = useState<Knock[]>([]);

    useEffect(() => {
        const fetchRoommateDetails = async () => {
            if (!user || !id) {
                toast.error("Please login to view roommate details");
                navigate("/auth/sign-in");
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Fetch user profile
                const userResponse = await api.get(`/users/${id}`);
                setRoommate(userResponse.data);

                // Fetch personality profile
                const personalityResponse = await api.get(`/personalities?userId=${id}`);
                setPersonality(personalityResponse.data);

                // Fetch compatibility details
                const compatibilityResponse = await api.post(`/matching/compare/${user._id || user.id}/${id}`);
                if (compatibilityResponse.data.success) {
                    setCompatibility(compatibilityResponse.data.compatibility);
                }

                // Fetch knock status between current user and this roommate
                try {
                    const knocksResponse = await api.get(`/knocks?userId=${user._id || user.id}`);
                    const knocks = knocksResponse.data;
                    setAllKnocks(knocks);

                    // Find ANY knock between current user and viewed roommate
                    const existingKnock = knocks.find((k: Knock) =>
                        (k.senderId === Number(user._id || user.id) && k.recipientId === Number(id)) ||
                        (k.recipientId === Number(user._id || user.id) && k.senderId === Number(id))
                    );

                    if (existingKnock) {
                        setKnock(existingKnock);
                    }
                } catch (knockError) {
                    console.log("No existing knocks found");
                }
            } catch (error: any) {
                console.error("Error fetching roommate details:", error);
                const errorMessage = error.response?.data?.error || "Failed to load roommate details";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoommateDetails();
    }, [user, id, navigate]);

    if (isLoading) {
        return (
            <section className="min-h-screen bg-background py-6 px-4 sm:px-6 flex items-center justify-center">
                <div className="text-center">
                    <Spinner isLoading={true} label="Loading roommate profile...">
                        <div className="w-12 h-12" />
                    </Spinner>
                </div>
            </section>
        );
    }

    if (error || !roommate || !personality) {
        return (
            <section className="min-h-screen bg-background py-6 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <Card className="p-8">
                        <p className="text-red-500 dark:text-red-400 mb-4">
                            {error || "Roommate profile not found"}
                        </p>
                        <Button
                            onClick={() => navigate("/roommates")}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                            Back to Matches
                        </Button>
                    </Card>
                </div>
            </section>
        );
    }

    const handleKnockKnock = async () => {
        if (!user || !id) return;

        try {
            setKnockLoading(true);
            const response = await api.post('/knocks', {
                recipientId: id
            });

            setKnock(response.data);

            // Refresh all knocks to ensure state consistency
            const knocksResponse = await api.get(`/knocks?userId=${user._id || user.id}`);
            setAllKnocks(knocksResponse.data);

            toast.success("Knock sent successfully!");
        } catch (error: any) {
            console.error("Error sending knock:", error);
            toast.error(error.response?.data?.error || "Failed to send knock");
        } finally {
            setKnockLoading(false);
        }
    };

    const handleKnockBack = async () => {
        if (!user || !id) return;

        try {
            setKnockLoading(true);
            const response = await api.post('/knocks', {
                recipientId: id
            });

            toast.success("Knock sent! You're now connected!");

            // Refresh knock data to get updated state
            const knocksResponse = await api.get(`/knocks?userId=${user._id || user.id}`);
            const knocks = knocksResponse.data;
            setAllKnocks(knocks);

            const existingKnock = knocks.find((k: Knock) =>
                (k.senderId === Number(user._id || user.id) && k.recipientId === Number(id)) ||
                (k.recipientId === Number(user._id || user.id) && k.senderId === Number(id))
            );
            setKnock(existingKnock);
        } catch (error: any) {
            console.error("Error knocking back:", error);
            toast.error(error.response?.data?.error || "Failed to send knock");
        } finally {
            setKnockLoading(false);
        }
    };

    const renderKnockButton = () => {
        if (!user || !id) return null;

        const currentUserId = Number(user._id || user.id);
        const roommateId = Number(id);

        // Check for mutual knocks using allKnocks state
        const sentKnock = allKnocks.find((k: Knock) =>
            k.senderId === currentUserId && k.recipientId === roommateId
        );

        const receivedKnock = allKnocks.find((k: Knock) =>
            k.senderId === roommateId && k.recipientId === currentUserId
        );

        const hasMutualKnock = !!(sentKnock && receivedKnock);

        // Mutual knock exists (Connection established)
        if (hasMutualKnock) {
            return (
                <Button
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    onClick={() => navigate(`/connection/${roommateId}`)}
                >
                    View Connection
                </Button>
            );
        }

        // I sent knock to them - show "Knock Sent"
        if (sentKnock) {
            return (
                <Button
                    className="w-full mt-4"
                    variant="outline"
                    disabled
                >
                    Knock Sent ✓
                </Button>
            );
        }

        // They sent knock to me - show "Knock Back" button
        if (receivedKnock) {
            return (
                <Button
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    onClick={handleKnockBack}
                    disabled={knockLoading}
                >
                    {knockLoading ? "Sending..." : "Knock Back"}
                </Button>
            );
        }

        // No knock exists - show "Knock Knock" button
        return (
            <Button
                className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                onClick={handleKnockKnock}
                disabled={knockLoading}
            >
                {knockLoading ? "Sending..." : "Knock Knock"}
            </Button>
        );
    };

    // Helper functions to format data
    const getYear = () => {
        if (!roommate.dateOfBirth) return "Student";
        const birthYear = new Date(roommate.dateOfBirth).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        if (age <= 19) return "Freshman";
        if (age <= 20) return "Sophomore";
        if (age <= 21) return "Junior";
        if (age <= 22) return "Senior";
        return "Graduate";
    };

    const formatStudyHabits = () => {
        const habits = personality.study_habits;
        if (habits === "silent") return "Needs quiet for studying";
        if (habits === "some_noise") return "Okay with some noise while studying";
        return "Flexible with study environment";
    };

    const formatCleanliness = () => {
        const clean = personality.cleanliness;
        if (clean === "Tidy") return "Very clean and organized";
        if (clean === "Moderate") return "Moderately clean";
        return "Relaxed about cleanliness";
    };

    const formatSocialHabits = () => {
        const social = personality.social;
        const goingOut = personality.going_out;
        if (social === "Social" && goingOut === "Frequent") return "Very social, goes out often";
        if (social === "Social") return "Social, enjoys gatherings";
        if (social === "Moderate") return "Moderately social";
        return "Prefers quiet time";
    };

    const formatSleepSchedule = () => {
        const sleep = personality.sleep_type;
        if (sleep === "Early Bird") return "Early riser";
        if (sleep === "Night Owl") return "Night owl";
        return "Flexible sleep schedule";
    };

    const formatHobbies = () => {
        const lifestyle = personality.lifestyle.join(", ");
        return lifestyle || "Various interests";
    };

    return (
        <section className="min-h-screen bg-background py-6 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Back Button - Fixed width */}
                <Button
                    variant="ghost"
                    onClick={() => navigate("/roommates")}
                    className="w-fit mb-6 sm:mb-8 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Matches
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="border-2 border-border bg-card shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    {/* Profile Image */}
                                    <div className="relative mb-6">
                                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1 shadow-xl">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${roommate.name}`}
                                                alt={roommate.name}
                                                className="w-full h-full rounded-full bg-muted"
                                            />
                                        </div>
                                        <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-background">
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Profile Info */}
                                    <h2 className="text-2xl font-bold mb-2 text-foreground text-center">
                                        {roommate.name}
                                    </h2>
                                    <p className="text-muted-foreground text-center mb-1 text-sm">
                                        {roommate.address || "University Student"}
                                    </p>
                                    <Badge variant="secondary" className="mb-6">
                                        {getYear()}
                                    </Badge>

                                    {/* Knock Knock Button */}
                                    {renderKnockButton()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Preferences */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Matched Preferences */}
                        <Card className="border-2 border-border bg-card shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">
                                        Matched Preferences
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Nationality */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Nationality
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {personality.nationality || "Not specified"}
                                        </p>
                                    </div>

                                    {/* Study Habits */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Study Habits
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {formatStudyHabits()}
                                        </p>
                                    </div>

                                    {/* Cleanliness */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 md:col-span-2 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Cleanliness
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {formatCleanliness()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Other Preferences */}
                        <Card className="border-2 border-border bg-card shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                                        <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">
                                        Other Preferences
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Sleep Schedule */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Sleep Schedule
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {formatSleepSchedule()}
                                        </p>
                                    </div>

                                    {/* Social Habits */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Social Habits
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {formatSocialHabits()}
                                        </p>
                                    </div>

                                    {/* Hobbies */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 md:col-span-2 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Hobbies & Interests
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {formatHobbies()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Compatibility Analysis */}
                        {compatibility && compatibility.detailedScores && (
                            <Card className="border-2 border-border bg-card shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">
                                            Compatibility Analysis
                                        </h3>
                                        <Badge variant="secondary" className="ml-auto">
                                            {compatibility.matchPercentage}% Match
                                        </Badge>
                                    </div>

                                    {/* Overall Summary */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-foreground font-medium">
                                            {compatibility.compatibility.overallReason}
                                        </p>
                                    </div>

                                    {/* Detailed Scores */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-muted/50 border border-border rounded-lg p-4">
                                            <p className="text-muted-foreground text-sm mb-2 font-medium">
                                                Your Preferences vs Their Personality
                                            </p>
                                            <p className="font-semibold text-foreground text-lg">
                                                {compatibility.detailedScores.yourPreferencesVsTheirPersonality}%
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                How well their traits match what you want
                                            </p>
                                        </div>

                                        <div className="bg-muted/50 border border-border rounded-lg p-4">
                                            <p className="text-muted-foreground text-sm mb-2 font-medium">
                                                Your Personality vs Their Preferences
                                            </p>
                                            <p className="font-semibold text-foreground text-lg">
                                                {compatibility.detailedScores.yourPersonalityVsTheirPreferences}%
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                How well your traits match what they want
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stage 1: Your Preferences → Their Personality */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <div className="w-6 h-6 bg-green-500/10 rounded flex items-center justify-center">
                                                <span className="text-green-600 dark:text-green-400 text-sm font-bold">1</span>
                                            </div>
                                            Your Preferences → Their Personality
                                            <Badge variant="outline" className="text-xs">
                                                {compatibility.detailedScores.yourPreferencesVsTheirPersonality}%
                                            </Badge>
                                        </h4>
                                        <div className="space-y-2">
                                            {compatibility.detailedScores.breakdown.preferencesMatchDetails.map((reason, index) => (
                                                <div key={index} className="bg-muted/30 border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                                                    <p className="text-sm text-foreground">{reason}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stage 2: Your Personality → Their Preferences */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <div className="w-6 h-6 bg-purple-500/10 rounded flex items-center justify-center">
                                                <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">2</span>
                                            </div>
                                            Your Personality → Their Preferences
                                            <Badge variant="outline" className="text-xs">
                                                {compatibility.detailedScores.yourPersonalityVsTheirPreferences}%
                                            </Badge>
                                        </h4>
                                        <div className="space-y-2">
                                            {compatibility.detailedScores.breakdown.personalityMatchDetails.map((reason, index) => (
                                                <div key={index} className="bg-muted/30 border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                                                    <p className="text-sm text-foreground">{reason}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                                            <p className="text-green-700 dark:text-green-300 text-sm font-medium mb-1">
                                                Personality Match
                                            </p>
                                            <p className="text-green-800 dark:text-green-200 text-xs">
                                                {compatibility.compatibility.personalityMatch}
                                            </p>
                                        </div>

                                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                                            <p className="text-blue-700 dark:text-blue-300 text-sm font-medium mb-1">
                                                Lifestyle Match
                                            </p>
                                            <p className="text-blue-800 dark:text-blue-200 text-xs">
                                                {compatibility.compatibility.lifestyleMatch}
                                            </p>
                                        </div>

                                        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center">
                                            <p className="text-purple-700 dark:text-purple-300 text-sm font-medium mb-1">
                                                Preference Match
                                            </p>
                                            <p className="text-purple-800 dark:text-purple-200 text-xs">
                                                {compatibility.compatibility.preferenceMatch}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}