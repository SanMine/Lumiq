import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ArrowLeft, Heart, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "@/api";
import { toast } from "sonner";
import Loader from "@/components/shared/loader";

interface Knock {
    _id: string;
    senderId: number;
    recipientId: number;
    status: string;
    createdAt: string;
}

interface UserProfile {
    _id: number;
    name: string;
    email: string;
}

interface KnockWithUser extends Knock {
    senderProfile?: UserProfile;
}

export default function KnockKnockPage() {
    const navigate = useNavigate();
    const { user, isLoading: authLoading } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [allKnocks, setAllKnocks] = useState<Knock[]>([]);
    const [incomingKnocks, setIncomingKnocks] = useState<KnockWithUser[]>([]);
    const [knockingBack, setKnockingBack] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchIncomingKnocks = async () => {
            if (!user) {
                navigate('/auth/sign-in');
                return;
            }

            try {
                setIsLoading(true);
                const currentUserId = user._id || user.id;

                // Fetch all knocks for current user
                const knocksResponse = await api.get(`/knocks?userId=${currentUserId}`);
                const knocks = knocksResponse.data;
                setAllKnocks(knocks);

                // Filter for:
                // 1. Incoming knocks (where current user is recipient)
                // 2. Outgoing ACCEPTED knocks (where current user is sender AND status is accepted)
                const relevantKnocks = knocks.filter((k: Knock) =>
                    k.recipientId === currentUserId ||
                    (k.senderId === currentUserId && k.status === 'accepted')
                );

                // Fetch user profiles for each knock
                const knocksWithProfiles = await Promise.all(
                    relevantKnocks.map(async (knock: Knock) => {
                        try {
                            // If current user is recipient, fetch sender profile
                            // If current user is sender (accepted knock), fetch recipient profile
                            const otherUserId = knock.recipientId === currentUserId
                                ? knock.senderId
                                : knock.recipientId;

                            const userResponse = await api.get(`/users/${otherUserId}`);
                            return { ...knock, senderProfile: userResponse.data };
                        } catch (error) {
                            console.error(`Failed to fetch user:`, error);
                            return knock;
                        }
                    })
                );

                setIncomingKnocks(knocksWithProfiles);
            } catch (error: any) {
                console.error("Error fetching knocks:", error);
                toast.error(error.response?.data?.error || "Failed to load knocks");
            } finally {
                setIsLoading(false);
            }
        };

        fetchIncomingKnocks();
    }, [user, navigate]);

    const handleKnockBack = async (knock: KnockWithUser) => {
        if (!user) return;

        try {
            setKnockingBack(prev => new Set(prev).add(knock.senderId));

            // Accept the existing knock instead of creating a new one
            await api.put(`/knocks/${knock._id}/accept`);

            toast.success("Knock accepted! You're now connected!");

            // Refresh knocks list
            const currentUserId = user._id || user.id;
            const knocksResponse = await api.get(`/knocks?userId=${currentUserId}`);
            const knocks = knocksResponse.data;
            setAllKnocks(knocks);

            // Filter with same logic as initial fetch
            const relevantKnocks = knocks.filter((k: Knock) =>
                k.recipientId === currentUserId ||
                (k.senderId === currentUserId && k.status === 'accepted')
            );

            const knocksWithProfiles = await Promise.all(
                relevantKnocks.map(async (k: Knock) => {
                    try {
                        const otherUserId = k.recipientId === currentUserId
                            ? k.senderId
                            : k.recipientId;
                        const userResponse = await api.get(`/users/${otherUserId}`);
                        return { ...k, senderProfile: userResponse.data };
                    } catch (error) {
                        return k;
                    }
                })
            );

            setIncomingKnocks(knocksWithProfiles);
        } catch (error: any) {
            console.error("Error accepting knock:", error);
            toast.error(error.response?.data?.error || "Failed to accept knock");
        } finally {
            setKnockingBack(prev => {
                const newSet = new Set(prev);
                newSet.delete(knock.senderId);
                return newSet;
            });
        }
    };

    const checkHasConnection = (knock: KnockWithUser): boolean => {
        if (!user) return false;
        const currentUserId = user._id || user.id;

        // Check if the knock has been accepted (meaning connection is established)
        if (knock.status === 'accepted') return true;

        // Check if there's a knock from current user to this sender that's been accepted
        return allKnocks.some(k =>
            k.senderId === currentUserId &&
            k.recipientId === knock.senderId &&
            k.status === 'accepted'
        );
    };

    if (authLoading || isLoading) {
        return <Loader />;
    }

    return (
        <section className="min-h-screen bg-background py-6 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/account')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Account
                </Button>

                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        Knock Knock! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        People who are interested in being your roommate
                    </p>
                </div>

                {/* Incoming Knocks List */}
                {incomingKnocks.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                                <Heart className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">No Knocks Yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    When someone knocks on your profile, they'll appear here
                                </p>
                                <Button onClick={() => navigate('/roommates')}>
                                    Find Roommates
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {incomingKnocks.map((knock) => {
                            const hasConnection = checkHasConnection(knock);

                            return (
                                <Card key={knock._id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between gap-4">
                                            {/* User Info */}
                                            <div
                                                className="flex items-center gap-4 flex-1 cursor-pointer"
                                                onClick={() => navigate(`/roommates/${knock.senderId}`)}
                                            >
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-0.5">
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${knock.senderProfile?.name || knock.senderId}`}
                                                        alt={knock.senderProfile?.name || "User"}
                                                        className="w-full h-full rounded-full bg-muted"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">
                                                        {knock.senderProfile?.name || `User ${knock.senderId}`}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {knock.senderProfile?.email || ""}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Knocked {new Date(knock.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                {(() => {
                                                    // Determine the "other user" ID
                                                    // If current user is recipient, other user is sender
                                                    // If current user is sender (accepted outgoing), other user is recipient
                                                    const currentUserId = user?._id || user?.id;
                                                    const otherUserId = knock.recipientId === currentUserId
                                                        ? knock.senderId
                                                        : knock.recipientId;

                                                    return (
                                                        <>
                                                            {hasConnection ? (
                                                                <Button
                                                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                                                    onClick={() => navigate(`/connection/${otherUserId}`)}
                                                                >
                                                                    View Connection
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                                                    onClick={() => handleKnockBack(knock)}
                                                                    disabled={knockingBack.has(knock.senderId)}
                                                                >
                                                                    {knockingBack.has(knock.senderId) ? "Sending..." : "Knock Back"}
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => navigate(`/roommates/${otherUserId}`)}
                                                            >
                                                                View Profile
                                                            </Button>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
