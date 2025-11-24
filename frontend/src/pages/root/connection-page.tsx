import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Mail, MapPin, Phone, Calendar, Coffee, Moon, Book, Sparkles, Wine, Heart, ThermometerSnowflake, MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "@/api";
import { toast } from "sonner";
import Loader from "@/components/shared/loader";
import Chatbot from "@/components/shared/chatbot";

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

interface Knock {
    _id: string;
    senderId: number;
    recipientId: number;
    status: string;
}

export default function ConnectionPage() {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const { user, isLoading: authLoading } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Current user data
    const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
    const [currentUserPersonality, setCurrentUserPersonality] = useState<Personality | null>(null);

    // Connected user data
    const [connectedUserProfile, setConnectedUserProfile] = useState<UserProfile | null>(null);
    const [connectedUserPersonality, setConnectedUserPersonality] = useState<Personality | null>(null);

    useEffect(() => {
        const fetchConnectionData = async () => {
            if (!user || !userId) {
                navigate('/auth/sign-in');
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const currentUserId = String(user._id || user.id);

                // Verify mutual knocks exist
                const knocksResponse = await api.get(`/knocks?userId=${currentUserId}`);
                const knocks = knocksResponse.data;

                // Check if there's a knock from current user to connected user
                const knockToThem = knocks.find((k: Knock) =>
                    k.senderId === Number(currentUserId) && k.recipientId === Number(userId)
                );

                // Check if there's a knock from connected user to current user
                const knockFromThem = knocks.find((k: Knock) =>
                    k.senderId === Number(userId) && k.recipientId === Number(currentUserId)
                );

                console.log("🔍 Connection validation:", {
                    currentUserId,
                    connectedUserId: userId,
                    knockToThem,
                    knockFromThem,
                    knockToThemStatus: knockToThem?.status,
                    knockFromThemStatus: knockFromThem?.status
                });

                // Connection is established if ANY knock between them is accepted
                // (Either A knocked B and B accepted, OR B knocked A and A accepted)
                const hasConnection =
                    (knockToThem && knockToThem.status === 'accepted') ||
                    (knockFromThem && knockFromThem.status === 'accepted');

                console.log("✅ Has connection:", hasConnection);

                if (!hasConnection) {
                    setError("Connection not established. Knock must be accepted.");
                    toast.error("No mutual connection found");
                    navigate('/roommates');
                    return;
                }

                // Fetch current user data
                const currentUserRes = await api.get(`/users/${currentUserId}`);
                setCurrentUserProfile(currentUserRes.data);

                const currentPersonalityRes = await api.get(`/personalities?userId=${currentUserId}`);
                setCurrentUserPersonality(currentPersonalityRes.data);

                // Fetch connected user data
                const connectedUserRes = await api.get(`/users/${userId}`);
                setConnectedUserProfile(connectedUserRes.data);

                const connectedPersonalityRes = await api.get(`/personalities?userId=${userId}`);
                setConnectedUserPersonality(connectedPersonalityRes.data);

            } catch (error: any) {
                console.error("Error fetching connection data:", error);
                const errorMessage = error.response?.data?.error || "Failed to load connection data";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConnectionData();
    }, [user, userId, navigate]);

    if (authLoading || isLoading) {
        return <Loader />;
    }

    if (error || !currentUserProfile || !currentUserPersonality || !connectedUserProfile || !connectedUserPersonality) {
        return (
            <section className="min-h-screen bg-background py-6 px-4 sm:px-6 flex items-center justify-center">
                <Card className="p-8 max-w-md text-center">
                    <p className="text-red-500 dark:text-red-400 mb-4">
                        {error || "Failed to load comparison data"}
                    </p>
                    <Button onClick={() => navigate('/roommates')}>
                        Back to Matches
                    </Button>
                </Card>
            </section>
        );
    }

    const ProfileCard = ({ userProfile, personality, title }: { userProfile: UserProfile, personality: Personality, title: string }) => (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                    <p className="text-sm text-muted-foreground">Complete Profile</p>
                </div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1 shadow-xl">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.name}`}
                        alt={userProfile.name}
                        className="w-full h-full rounded-full bg-background"
                    />
                </div>
            </div>

            {/* Basic Information */}
            <Card className="border-2 border-border bg-card shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                            Basic Information
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium">Name</p>
                            </div>
                            <p className="font-semibold text-foreground">{personality.nickname || userProfile.name}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-muted-foreground text-sm font-medium">Age</p>
                                </div>
                                <p className="font-semibold text-foreground">{personality.age} years</p>
                            </div>
                            <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-muted-foreground text-sm font-medium">Gender</p>
                                </div>
                                <p className="font-semibold text-foreground">{personality.gender}</p>
                            </div>
                        </div>

                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium">Nationality</p>
                            </div>
                            <p className="font-semibold text-foreground">{personality.nationality || "Not specified"}</p>
                        </div>

                        {personality.description && (
                            <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-muted-foreground text-sm font-medium">Bio</p>
                                </div>
                                <p className="text-sm italic text-muted-foreground">{personality.description}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Lifestyle Preferences */}
            <Card className="border-2 border-border bg-card shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                            <Coffee className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                            Lifestyle
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                                    <Moon className="w-4 h-4" /> Sleep Schedule
                                </p>
                                <Badge variant="outline">{personality.sleep_type}</Badge>
                            </div>
                        </div>

                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium">Lifestyle</p>
                                <Badge variant="secondary">{personality.lifestyle[0] || "Moderate"}</Badge>
                            </div>
                        </div>

                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                                    <Book className="w-4 h-4" /> Study Habits
                                </p>
                                <Badge variant="outline">{personality.study_habits}</Badge>
                            </div>
                        </div>

                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Cleanliness
                                </p>
                                <Badge variant="secondary">{personality.cleanliness}</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Social Preferences */}
            <Card className="border-2 border-border bg-card shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <Wine className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                            Social
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium">Social Level</p>
                                <Badge>{personality.social}</Badge>
                            </div>
                        </div>

                        {personality.MBTI && (
                            <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-muted-foreground text-sm font-medium">MBTI</p>
                                    <Badge variant="outline">{personality.MBTI}</Badge>
                                </div>
                            </div>
                        )}

                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium">Going Out</p>
                                <Badge variant="secondary">{personality.going_out}</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Habits */}
            <Card className="border-2 border-border bg-card shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                            Habits
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium">Smoking</p>
                                <Badge variant={personality.smoking ? "destructive" : "secondary"}>
                                    {personality.smoking ? "Yes" : "No"}
                                </Badge>
                            </div>
                        </div>

                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                                    <Wine className="w-4 h-4" /> Drinking
                                </p>
                                <Badge variant="outline">{personality.drinking}</Badge>
                            </div>
                        </div>

                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium">Pets</p>
                                <Badge variant="secondary">{personality.pets}</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Environmental Preferences */}
            <Card className="border-2 border-border bg-card shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                            <ThermometerSnowflake className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                            Environment
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium">Noise Tolerance</p>
                                <Badge>{personality.noise_tolerance}</Badge>
                            </div>
                        </div>

                        <div className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium">Temperature</p>
                                <Badge variant="outline">{personality.temperature}</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <section className="min-h-screen bg-background py-6 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/knockknock')}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                            Roommate Comparison
                        </h1>
                        <p className="text-muted-foreground">
                            Compare your profiles side-by-side
                        </p>
                    </div>
                </div>

                {/* Split View - Half and Half */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side - Current User */}
                    <div>
                        <ProfileCard
                            userProfile={currentUserProfile}
                            personality={currentUserPersonality}
                            title="You"
                        />
                    </div>

                    {/* Right Side - Matched User */}
                    <div>
                        <ProfileCard
                            userProfile={connectedUserProfile}
                            personality={connectedUserPersonality}
                            title={connectedUserProfile.name}
                        />
                    </div>
                </div>
            </div>

            {/* Floating Chatbot */}
            <Chatbot />
        </section>
    );
}
