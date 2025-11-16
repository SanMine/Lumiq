import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "@/api";
import { toast } from "sonner";
import Spinner from "@/components/shared/spinner";

interface RoommateMatch {
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

export default function RoommatesPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [roommates, setRoommates] = useState<RoommateMatch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            if (!user) {
                toast.error("Please login to view roommate matches");
                navigate("/auth/sign-in");
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Fetch roommate matches from the backend
                const response = await api.post(`/matching/find-roommates/${user._id || user.id}`);
                
                if (response.data.success) {
                    setRoommates(response.data.matches || []);
                    
                    if (response.data.matches.length === 0) {
                        toast.info("No roommate matches found. Make sure other users have completed their personality profiles.");
                    }
                } else {
                    setError("Failed to fetch roommate matches");
                }
            } catch (error: any) {
                console.error("Error fetching roommate matches:", error);
                const errorMessage = error.response?.data?.error || "Failed to load roommate matches";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatches();
    }, [user, navigate]);

    const getCompatibilityColor = (compatibility: number) => {
        if (compatibility >= 90) return "text-green-500 dark:text-green-400";
        if (compatibility >= 75) return "text-cyan-500 dark:text-cyan-400";
        if (compatibility >= 60) return "text-lime-500 dark:text-lime-400";
        return "text-yellow-500 dark:text-yellow-400";
    };

    if (isLoading) {
        return (
            <section className="min-h-screen bg-background px-6 py-8 flex items-center justify-center">
                <div className="text-center">
                    <Spinner isLoading={true} label="Finding your perfect roommates...">
                        <div className="w-12 h-12" />
                    </Spinner>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen bg-background px-6 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                        Roommate Matching Results
                    </h1>
                    <Card className="p-8">
                        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                            Try Again
                        </Button>
                    </Card>
                </div>
            </section>
        );
    }

    if (roommates.length === 0) {
        return (
            <section className="min-h-screen bg-background px-6 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                        Roommate Matching Results
                    </h1>
                    <Card className="p-8">
                        <p className="text-muted-foreground mb-4">
                            No roommate matches found yet. Make sure you've completed your personality profile and roommate preferences.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={() => navigate("/roommate-matching")}
                                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                            >
                                Set Preferences
                            </Button>
                            <Button
                                onClick={() => navigate("/my-account")}
                                variant="outline"
                            >
                                Complete Profile
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-background px-6 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground text-center">
                    Roommate Matching Results
                </h1>

                <div className="space-y-4">
                    {roommates.map((roommate) => (
                        <Card
                            key={roommate.candidateId}
                            className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-lg transition-all duration-300 border border-border bg-card"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${roommate.candidateName}`}
                                        alt={roommate.candidateName}
                                        className="w-16 h-16 rounded-full bg-muted ring-2 ring-border"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground">
                                        {roommate.candidateName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Compatibility:{" "}
                                        <span className={`font-semibold ${getCompatibilityColor(roommate.matchPercentage)}`}>
                                            {roommate.matchPercentage}%
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate(`/roommates/${roommate.candidateId}`)}
                                size="lg"
                                className="w-full sm:w-auto text-white cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30"
                            >
                                View Profile
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}