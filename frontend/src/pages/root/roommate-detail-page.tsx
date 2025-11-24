import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Info, AlertTriangle, Sparkles, BrainCircuit } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "@/api";
import { toast } from "sonner";
import Spinner from "@/components/shared/spinner";
import { Progress } from "@/components/ui/progress";

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

interface AiAnalysis {
    compatibilityScore: number;
    bottom_line: string;
    spark: string;
    friction: string;
    strengths: Array<{
        category: string;
        explanation: string;
    }>;
    concerns: Array<{
        category: string;
        explanation: string;
    }>;
    summary: string;
    cached?: boolean;
}

interface Knock {
    _id: string;
    senderId: number;
    recipientId: number;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    updatedAt: string;
}

interface PreferredRoommate {
    preferred_age_range?: { min: number; max: number };
    preferred_gender?: string;
    preferred_nationality?: string;
    preferred_sleep_type?: string;
    preferred_study_habits?: string;
    preferred_cleanliness?: string;
    preferred_social?: string;
    preferred_MBTI?: string;
    preferred_going_out?: string;
    preferred_smoking?: boolean;
    preferred_drinking?: string;
    preferred_pets?: boolean;
    preferred_noise_tolerance?: string;
    preferred_temperature?: string;
}

export default function RoommateDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [roommate, setRoommate] = useState<UserProfile | null>(null);
    const [personality, setPersonality] = useState<Personality | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAiLoading, setIsAiLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Knock-related state
    const [knock, setKnock] = useState<Knock | null>(null);
    const [knockLoading, setKnockLoading] = useState(false);
    const [allKnocks, setAllKnocks] = useState<Knock[]>([]);

    // Current user's preferences for matching
    const [myPreferences, setMyPreferences] = useState<PreferredRoommate | null>(null);

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

                // Fetch knock status
                try {
                    const knocksResponse = await api.get(`/knocks?userId=${user._id || user.id}`);
                    const knocks = knocksResponse.data;
                    setAllKnocks(knocks);

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

                // Fetch current user's preferences for comparison
                try {
                    const preferencesResponse = await api.get(`/preferred_roommate?userId=${user._id || user.id}`);
                    setMyPreferences(preferencesResponse.data);
                } catch (prefError) {
                    console.log("No preferences found for current user");
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

    // Separate effect for AI analysis to allow independent loading
    useEffect(() => {
        const fetchAiAnalysis = async () => {
            if (!user || !id) return;

            try {
                setIsAiLoading(true);
                const response = await api.get(`/matching/ai-analysis/${user._id || user.id}/${id}`);
                if (response.data.success) {
                    setAiAnalysis({
                        compatibilityScore: response.data.compatibilityScore,
                        bottom_line: response.data.bottom_line,
                        spark: response.data.spark,
                        friction: response.data.friction,
                        strengths: response.data.strengths,
                        concerns: response.data.concerns,
                        summary: response.data.summary,
                        cached: response.data.cached
                    });
                }
            } catch (error) {
                console.error("Error fetching AI analysis:", error);
                // Don't show error toast here to avoid disrupting the main UI
                // Just let the AI section show a fallback or empty state if needed
            } finally {
                setIsAiLoading(false);
            }
        };

        fetchAiAnalysis();
    }, [user, id]);

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

    // Helper function to compare my preference against their personality
    const comparePreference = (
        myPref: any,
        theirValue: any,
        fieldType: 'string' | 'boolean' | 'any' = 'string'
    ): { isMatch: boolean; myValue: string; theirValue: string } => {
        // Handle if user hasn't set preferences
        if (!myPreferences || myPref === undefined || myPref === null || myPref === 'Any') {
            return {
                isMatch: true,
                myValue: 'Any',
                theirValue: String(theirValue || 'Not specified')
            };
        }

        // Handle boolean preferences (smoking, pets)
        if (fieldType === 'boolean') {
            const match = myPref === theirValue;
            return {
                isMatch: match,
                myValue: myPref ? 'Yes' : 'No',
                theirValue: theirValue ? 'Yes' : 'No'
            };
        }

        // Handle string/enum preferences
        if (fieldType === 'string' || fieldType === 'any') {
            // Normalize for comparison (case-insensitive)
            const prefNorm = String(myPref).toLowerCase().trim();
            const valueNorm = String(theirValue || '').toLowerCase().trim();

            const match = prefNorm === valueNorm || prefNorm === 'any' || prefNorm === 'flexible';
            return {
                isMatch: match,
                myValue: String(myPref),
                theirValue: String(theirValue || 'Not specified')
            };
        }

        return {
            isMatch: false,
            myValue: String(myPref),
            theirValue: String(theirValue)
        };
    };

    const handleKnockKnock = async () => {
        if (!user || !id) return;

        try {
            setKnockLoading(true);
            const response = await api.post('/knocks', {
                recipientId: id
            });

            setKnock(response.data);

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

            // Find the received knock
            const receivedKnock = allKnocks.find((k: Knock) =>
                k.senderId === Number(id) && k.recipientId === Number(user._id || user.id)
            );

            if (!receivedKnock) {
                toast.error("No knock found to accept");
                return;
            }

            // Accept the knock using the accept endpoint
            await api.put(`/knocks/${receivedKnock._id}/accept`);

            toast.success("Knock accepted! You're now connected!");

            // Refresh knocks
            const knocksResponse = await api.get(`/knocks?userId=${user._id || user.id}`);
            const knocks = knocksResponse.data;
            setAllKnocks(knocks);

            const existingKnock = knocks.find((k: Knock) =>
                (k.senderId === Number(user._id || user.id) && k.recipientId === Number(id)) ||
                (k.recipientId === Number(user._id || user.id) && k.senderId === Number(id))
            );
            setKnock(existingKnock);
        } catch (error: any) {
            console.error("Error accepting knock:", error);
            toast.error(error.response?.data?.error || "Failed to accept knock");
        } finally {
            setKnockLoading(false);
        }
    };

    const renderKnockButton = () => {
        if (!user || !id) return null;

        const currentUserId = Number(user._id || user.id);
        const roommateId = Number(id);

        const sentKnock = allKnocks.find((k: Knock) =>
            k.senderId === currentUserId && k.recipientId === roommateId
        );

        const receivedKnock = allKnocks.find((k: Knock) =>
            k.senderId === roommateId && k.recipientId === currentUserId
        );

        // Connection is established if either knock is accepted
        const hasConnection = !!(sentKnock?.status === 'accepted' || receivedKnock?.status === 'accepted');

        if (hasConnection) {
            return (
                <Button
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    onClick={() => navigate(`/connection/${roommateId}`)}
                >
                    View Connection
                </Button>
            );
        }

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

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 dark:text-green-400";
        if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-green-600 dark:bg-green-500";
        if (score >= 60) return "bg-yellow-500 dark:bg-yellow-500";
        return "bg-red-500 dark:bg-red-500";
    };

    return (
        <section className="min-h-screen bg-background py-6 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
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

                                    <h2 className="text-2xl font-bold mb-2 text-foreground text-center">
                                        {roommate.name}
                                    </h2>
                                    <p className="text-muted-foreground text-center mb-1 text-sm">
                                        {roommate.address || "University Student"}
                                    </p>
                                    <Badge variant="secondary" className="mb-6">
                                        {getYear()}
                                    </Badge>

                                    {renderKnockButton()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - AI Analysis & Preferences */}
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
                                    {(() => {
                                        const match = comparePreference(myPreferences?.preferred_nationality, personality.nationality);
                                        return (
                                            <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-muted-foreground text-sm font-medium">
                                                        Nationality
                                                    </p>
                                                    <Badge variant={match.isMatch ? "default" : "destructive"} className="text-xs">
                                                        {match.isMatch ? "Match" : "Unmatch"}
                                                    </Badge>
                                                </div>
                                                {match.isMatch ? (
                                                    <p className="font-semibold text-foreground">{match.theirValue}</p>
                                                ) : (
                                                    <p className="font-semibold text-foreground">{match.myValue} → {match.theirValue}</p>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Study Habits */}
                                    {(() => {
                                        const match = comparePreference(myPreferences?.preferred_study_habits, personality.study_habits);
                                        return (
                                            <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-muted-foreground text-sm font-medium">
                                                        Study Habits
                                                    </p>
                                                    <Badge variant={match.isMatch ? "default" : "destructive"} className="text-xs">
                                                        {match.isMatch ? "Match" : "Unmatch"}
                                                    </Badge>
                                                </div>
                                                {match.isMatch ? (
                                                    <p className="font-semibold text-foreground">{match.theirValue}</p>
                                                ) : (
                                                    <p className="font-semibold text-foreground">{match.myValue} → {match.theirValue}</p>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Cleanliness */}
                                    {(() => {
                                        const match = comparePreference(myPreferences?.preferred_cleanliness, personality.cleanliness);
                                        return (
                                            <div className="bg-muted/50 border border-border rounded-lg p-4 md:col-span-2 hover:bg-muted transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-muted-foreground text-sm font-medium">
                                                        Cleanliness
                                                    </p>
                                                    <Badge variant={match.isMatch ? "default" : "destructive"} className="text-xs">
                                                        {match.isMatch ? "Match" : "Unmatch"}
                                                    </Badge>
                                                </div>
                                                {match.isMatch ? (
                                                    <p className="font-semibold text-foreground">{match.theirValue}</p>
                                                ) : (
                                                    <p className="font-semibold text-foreground">{match.myValue} → {match.theirValue}</p>
                                                )}
                                            </div>
                                        );
                                    })()}
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
                                    {(() => {
                                        const match = comparePreference(myPreferences?.preferred_sleep_type, personality.sleep_type);
                                        return (
                                            <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-muted-foreground text-sm font-medium">
                                                        Sleep Schedule
                                                    </p>
                                                    <Badge variant={match.isMatch ? "default" : "destructive"} className="text-xs">
                                                        {match.isMatch ? "Match" : "Unmatch"}
                                                    </Badge>
                                                </div>
                                                {match.isMatch ? (
                                                    <p className="font-semibold text-foreground">{match.theirValue}</p>
                                                ) : (
                                                    <p className="font-semibold text-foreground">{match.myValue} → {match.theirValue}</p>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Social Habits */}
                                    {(() => {
                                        const match = comparePreference(myPreferences?.preferred_social, personality.social);
                                        return (
                                            <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-muted-foreground text-sm font-medium">
                                                        Social Habits
                                                    </p>
                                                    <Badge variant={match.isMatch ? "default" : "destructive"} className="text-xs">
                                                        {match.isMatch ? "Match" : "Unmatch"}
                                                    </Badge>
                                                </div>
                                                {match.isMatch ? (
                                                    <p className="font-semibold text-foreground">{match.theirValue}</p>
                                                ) : (
                                                    <p className="font-semibold text-foreground">{match.myValue} → {match.theirValue}</p>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Smoking */}
                                    {(() => {
                                        const match = comparePreference(myPreferences?.preferred_smoking, personality.smoking, 'boolean');
                                        return (
                                            <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-muted-foreground text-sm font-medium">
                                                        Smoking
                                                    </p>
                                                    <Badge variant={match.isMatch ? "default" : "destructive"} className="text-xs">
                                                        {match.isMatch ? "Match" : "Unmatch"}
                                                    </Badge>
                                                </div>
                                                {match.isMatch ? (
                                                    <p className="font-semibold text-foreground">{match.theirValue}</p>
                                                ) : (
                                                    <p className="font-semibold text-foreground">{match.myValue} → {match.theirValue}</p>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Drinking */}
                                    {(() => {
                                        const match = comparePreference(myPreferences?.preferred_drinking, personality.drinking);
                                        return (
                                            <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-muted-foreground text-sm font-medium">
                                                        Drinking
                                                    </p>
                                                    <Badge variant={match.isMatch ? "default" : "destructive"} className="text-xs">
                                                        {match.isMatch ? "Match" : "Unmatch"}
                                                    </Badge>
                                                </div>
                                                {match.isMatch ? (
                                                    <p className="font-semibold text-foreground">{match.theirValue}</p>
                                                ) : (
                                                    <p className="font-semibold text-foreground">{match.myValue} → {match.theirValue}</p>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Temperature */}
                                    {(() => {
                                        const match = comparePreference(myPreferences?.preferred_temperature, personality.temperature);
                                        return (
                                            <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-muted-foreground text-sm font-medium">
                                                        Temperature
                                                    </p>
                                                    <Badge variant={match.isMatch ? "default" : "destructive"} className="text-xs">
                                                        {match.isMatch ? "Match" : "Unmatch"}
                                                    </Badge>
                                                </div>
                                                {match.isMatch ? (
                                                    <p className="font-semibold text-foreground">{match.theirValue}</p>
                                                ) : (
                                                    <p className="font-semibold text-foreground">{match.myValue} → {match.theirValue}</p>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Going Out */}
                                    {(() => {
                                        const match = comparePreference(myPreferences?.preferred_going_out, personality.going_out);
                                        return (
                                            <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-muted-foreground text-sm font-medium">
                                                        Going Out
                                                    </p>
                                                    <Badge variant={match.isMatch ? "default" : "destructive"} className="text-xs">
                                                        {match.isMatch ? "Match" : "Unmatch"}
                                                    </Badge>
                                                </div>
                                                {match.isMatch ? (
                                                    <p className="font-semibold text-foreground">{match.theirValue}</p>
                                                ) : (
                                                    <p className="font-semibold text-foreground">{match.myValue} → {match.theirValue}</p>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Compatibility Analysis */}
                        <Card className="border-2 border-border bg-card shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 border-b border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <BrainCircuit className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                            AI Risk Analysis
                                            {aiAnalysis?.cached && (
                                                <Badge variant="outline" className="text-[10px] h-5">Cached</Badge>
                                            )}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Honest. Blunt. Actionable.</p>
                                    </div>
                                </div>

                                {isAiLoading ? (
                                    <div className="space-y-4 animate-pulse">
                                        <div className="h-4 bg-muted rounded w-3/4"></div>
                                        <div className="h-20 bg-muted rounded"></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-32 bg-muted rounded"></div>
                                            <div className="h-32 bg-muted rounded"></div>
                                        </div>
                                    </div>
                                ) : aiAnalysis ? (
                                    <div className="space-y-6">
                                        {/* Score Section */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-semibold text-sm">Overall Match Score</span>
                                                    <span className={`font-bold ${getScoreColor(aiAnalysis.compatibilityScore)}`}>
                                                        {aiAnalysis.compatibilityScore}%
                                                    </span>
                                                </div>
                                                <Progress value={aiAnalysis.compatibilityScore} className="h-3" indicatorClassName={getScoreBg(aiAnalysis.compatibilityScore)} />
                                            </div>
                                        </div>

                                        {/* Bottom Line */}
                                        <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                                            <h4 className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Bottom Line</h4>
                                            <p className="text-lg font-medium leading-relaxed italic">
                                                "{aiAnalysis.bottom_line}"
                                            </p>
                                        </div>

                                        {/* Spark & Friction */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                                <h4 className="text-green-600 dark:text-green-400 font-bold flex items-center gap-2 mb-2">
                                                    <Sparkles className="w-4 h-4" />
                                                    The Spark
                                                </h4>
                                                <p className="text-sm text-foreground/90">{aiAnalysis.spark}</p>
                                            </div>
                                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                                <h4 className="text-red-600 dark:text-red-400 font-bold flex items-center gap-2 mb-2">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    The Friction
                                                </h4>
                                                <p className="text-sm text-foreground/90">{aiAnalysis.friction}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Strengths */}
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Key Strengths
                                                </h4>
                                                {aiAnalysis.strengths.map((strength, idx) => (
                                                    <div key={idx} className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-lg p-3">
                                                        <p className="font-medium text-xs text-green-800 dark:text-green-300 mb-1">
                                                            {strength.category}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {strength.explanation}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Concerns */}
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Potential Concerns
                                                </h4>
                                                {aiAnalysis.concerns.length > 0 ? (
                                                    aiAnalysis.concerns.map((concern, idx) => (
                                                        <div key={idx} className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg p-3">
                                                            <p className="font-medium text-xs text-amber-800 dark:text-amber-300 mb-1">
                                                                {concern.category}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {concern.explanation}
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                                                        <p className="text-xs text-muted-foreground">No major concerns identified!</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground">
                                        Unable to load AI analysis at this time.
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}