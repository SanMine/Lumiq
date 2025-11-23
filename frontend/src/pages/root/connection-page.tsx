import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Mail, MapPin, Phone, Calendar, Coffee, Moon, Book, Sparkles, Wine, Heart, ThermometerSnowflake } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "@/api";
import { toast } from "sonner";
import Loader from "@/components/shared/loader";

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

                // Verify mutual knocks (both users knocked each other)
                if (!knockToThem || !knockFromThem) {
                    setError("Connection not established. Both users must knock each other.");
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                    <p className="text-sm text-muted-foreground">Complete Profile</p>
                </div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.name}`}
                        alt={userProfile.name}
                        className="w-full h-full rounded-full bg-muted"
                    />
                </div>
            </div>

            {/* Basic Information */}
            <Card className="border-2 border-border">
                <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{personality.nickname || userProfile.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{personality.age} years old</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">{personality.gender}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{personality.nationality || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{userProfile.email}</span>
                    </div>
                    {personality.contact && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{personality.contact}</span>
                        </div>
                    )}
                    {personality.description && (
                        <div className="pt-2 border-t border-border">
                            <p className="text-sm italic text-muted-foreground">{personality.description}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Lifestyle Preferences */}
            <Card className="border-2 border-border">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Coffee className="w-5 h-5" />
                        Lifestyle Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            Sleep Schedule
                        </span>
                        <Badge>{personality.sleep_type}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Lifestyle</span>
                        <Badge variant="outline">{personality.lifestyle[0] || "Moderate"}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Book className="w-4 h-4" />
                            Study Habits
                        </span>
                        <Badge>{personality.study_habits}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Cleanliness
                        </span>
                        <Badge>{personality.cleanliness}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Social Preferences */}
            <Card className="border-2 border-border">
                <CardHeader>
                    <CardTitle className="text-lg">Social Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Social Level</span>
                        <Badge>{personality.social}</Badge>
                    </div>
                    {personality.MBTI && (
                        <>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">MBTI</span>
                                <Badge variant="outline">{personality.MBTI}</Badge>
                            </div>
                        </>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Going Out</span>
                        <Badge>{personality.going_out}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Habits */}
            <Card className="border-2 border-border">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Habits
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Smoking</span>
                        <Badge variant={personality.smoking ? "destructive" : "secondary"}>
                            {personality.smoking ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Wine className="w-4 h-4" />
                            Drinking
                        </span>
                        <Badge>{personality.drinking}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Pets</span>
                        <Badge variant="outline">{personality.pets}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Environmental Preferences */}
            <Card className="border-2 border-border">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ThermometerSnowflake className="w-5 h-5" />
                        Environmental Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Noise Tolerance</span>
                        <Badge>{personality.noise_tolerance}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Temperature Preference</span>
                        <Badge variant="outline">{personality.temperature}</Badge>
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
                        onClick={() => navigate('/roommates')}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Matches
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
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
                        <ProfileCard
                            userProfile={currentUserProfile}
                            personality={currentUserPersonality}
                            title="You"
                        />
                    </div>

                    {/* Right Side - Matched User */}
                    <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-800">
                        <ProfileCard
                            userProfile={connectedUserProfile}
                            personality={connectedUserPersonality}
                            title={connectedUserProfile.name}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
