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
        if (habits === "silent") return "Focused, prefers quiet study environment";
        if (habits === "some_noise") return "Can study with some background noise";
        return "Flexible study environment";
    };

    const formatCleanliness = () => {
        const clean = personality.cleanliness;
        if (clean === "Tidy") return "Very tidy, prefers a clean living space";
        if (clean === "Moderate") return "Moderately tidy, balanced approach";
        return "Relaxed about cleanliness";
    };

    const formatSocialHabits = () => {
        const social = personality.social;
        const goingOut = personality.going_out;
        if (social === "Social" && goingOut === "Frequent") return "Very social, enjoys frequent gatherings";
        if (social === "Social") return "Enjoys occasional social gatherings";
        if (social === "Moderate") return "Moderately social, enjoys company sometimes";
        return "Prefers quiet time, occasional socializing";
    };

    const formatSleepSchedule = () => {
        const sleep = personality.sleep_type;
        if (sleep === "Early Bird") return "Early riser, goes to bed early";
        if (sleep === "Night Owl") return "Night owl, stays up late";
        return "Flexible sleep schedule";
    };

    const formatHobbies = () => {
        const lifestyle = personality.lifestyle.join(", ");
        const description = personality.description || "Various interests";
        return `${lifestyle}, ${description}`;
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

                                    {/* Contact Information */}
                                    <div className="w-full">
                                        <h3 className="text-lg font-semibold mb-4 text-foreground">
                                            Contact Information
                                        </h3>
                                        <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-center gap-3 hover:bg-muted transition-colors">
                                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                                <Mail className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm text-foreground break-all">
                                                {personality.contact || roommate.email}
                                            </span>
                                        </div>
                                    </div>
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
                                    {/* Major */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Major
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
                                    {/* Hobbies */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Hobbies
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {formatHobbies()}
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

                                    {/* Sleep Schedule */}
                                    <div className="bg-muted/50 border border-border rounded-lg p-4 md:col-span-2 hover:bg-muted transition-colors">
                                        <p className="text-muted-foreground text-sm mb-2 font-medium">
                                            Sleep Schedule
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {formatSleepSchedule()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}