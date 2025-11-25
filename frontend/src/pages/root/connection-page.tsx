import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Building2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "@/api";
import { toast } from "sonner";
import Loader from "@/components/shared/loader";
import FloatingChat from "@/components/shared/floating-chat";

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

interface Conversation {
    _id: number;
    participants: number[];
    lastMessage: string;
    lastMessageAt: string;
}

interface Message {
    _id: number;
    conversationId: number;
    sender: {
        _id: number;
        name: string;
        email: string;
    };
    text: string;
    readBy: number[];
    createdAt: string;
}

interface Dorm {
    _id: number;
    name: string;
    price: number;
    minDoublePrice?: number;
    pricePerPerson?: number;
    image_url?: string;
    images?: string[];
    address?: {
        addressLine1: string;
        subDistrict?: string;
        district?: string;
        province?: string;
        zipCode?: string;
        country?: string;
    };
    location?: string;
    fullAddress?: string;
}

interface SharedPriceRange {
    min: number;
    max: number;
    type: 'intersection' | 'average' | 'fallback (cheapest available)';
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

    // Chat data
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    // Shared Suggestions
    const [suggestedDorms, setSuggestedDorms] = useState<Dorm[]>([]);
    const [sharedPriceRange, setSharedPriceRange] = useState<SharedPriceRange | null>(null);

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

                // Create or get conversation
                try {
                    const conversationRes = await api.post('/conversations', {
                        recipientId: Number(userId)
                    });
                    setConversation(conversationRes.data);

                    // Fetch messages for this conversation
                    const messagesRes = await api.get(`/messages/${conversationRes.data._id}`);
                    setMessages(messagesRes.data);
                } catch (convError: any) {
                    console.error("Error with conversation:", convError);
                    // Don't fail the whole page if conversation fails
                }

                // Fetch shared dorm suggestions
                try {
                    const suggestionsRes = await api.get(`/dorms/shared-suggestions?userId=${userId}`);
                    setSuggestedDorms(suggestionsRes.data.dorms);
                    setSharedPriceRange(suggestionsRes.data.range);
                } catch (suggestionError) {
                    console.error("Error fetching suggestions:", suggestionError);
                }

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

    // Track active chat session on connection page
    useEffect(() => {
        if (!conversation) return;

        // Mark this conversation as active when on the connection page
        api.post('/chat-sessions/active', { conversationId: conversation._id })
            .then(() => {
                console.log(`✅ Connection page: Chat session activated for conversation ${conversation._id}`);
            })
            .catch(error => {
                console.error('Failed to activate chat session on connection page:', error);
            });

        // Cleanup: deactivate when leaving the page
        return () => {
            if (conversation) {
                api.delete(`/chat-sessions/active/${conversation._id}`)
                    .then(() => {
                        console.log(`🔒 Connection page: Chat session deactivated for conversation ${conversation._id}`);
                    })
                    .catch(error => {
                        console.error('Failed to deactivate chat session on connection page:', error);
                    });
            }
        };
    }, [conversation]);

    // Poll for new messages every 5 seconds
    useEffect(() => {
        if (!conversation) return;

        const interval = setInterval(async () => {
            try {
                const messagesRes = await api.get(`/messages/${conversation._id}`);
                setMessages(messagesRes.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [conversation]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !conversation || isSendingMessage) return;

        try {
            setIsSendingMessage(true);
            const messageRes = await api.post('/messages', {
                conversationId: conversation._id,
                text: text.trim()
            });

            // Add new message to the list
            setMessages(prev => [...prev, messageRes.data]);
        } catch (error: any) {
            console.error("Error sending message:", error);
            toast.error(error.response?.data?.error || "Failed to send message");
        } finally {
            setIsSendingMessage(false);
        }
    };

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
                            Connection with {connectedUserProfile.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Chat and get to know each other
                        </p>
                    </div>
                </div>


                {/* Shared Dorm Suggestions */}
                {suggestedDorms.length > 0 && (
                    <div className="mb-12">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold mb-2">Suggested Dorms</h2>
                            <p className="text-muted-foreground flex items-center justify-center gap-2">
                                {sharedPriceRange?.type === 'fallback (cheapest available)' ? (
                                    <>
                                        <span>No dorms found in your exact budget. Showing cheapest options:</span>
                                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-100 font-medium">
                                            Best Deals
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Based on your shared price range:
                                        <span className="font-semibold text-primary">
                                            {sharedPriceRange?.min === 0
                                                ? `Up to ฿${sharedPriceRange?.max.toLocaleString()}`
                                                : `฿${sharedPriceRange?.min.toLocaleString()} - ฿${sharedPriceRange?.max.toLocaleString()}`
                                            }
                                        </span>
                                        {sharedPriceRange?.type === 'average' && (
                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-100">
                                                Average Range
                                            </span>
                                        )}
                                    </>
                                )}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suggestedDorms.map((dorm) => (
                                <Card
                                    key={dorm._id}
                                    className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card rounded-2xl h-full flex flex-col p-0 gap-0"
                                    onClick={() => navigate(`/dorms/${dorm._id}`)}
                                >
                                    <div className="h-48 bg-muted relative overflow-hidden shrink-0">
                                        {/* Image */}
                                        {dorm.images && dorm.images.length > 0 ? (
                                            <img
                                                src={dorm.images[0]}
                                                alt={dorm.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : dorm.image_url ? (
                                            <img
                                                src={dorm.image_url}
                                                alt={dorm.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                                                <Building2 className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                        {/* Hover Overlay with Button */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <Button variant="secondary" className="rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>

                                    <CardContent className="p-5 flex flex-col flex-grow">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-xl mb-1 truncate group-hover:text-primary transition-colors">
                                                {dorm.name}
                                            </h3>
                                            <div className="flex items-start text-sm text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5 mr-1 mt-0.5 shrink-0" />
                                                <span className="line-clamp-2">
                                                    {dorm.fullAddress || dorm.location || "Location not set"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Shared Room Deal Section */}
                                        <div className="mt-auto bg-secondary/30 rounded-xl p-3 border border-border/50">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                                Shared Room Deal
                                            </p>

                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-muted-foreground">Double Room</span>
                                                <span className="font-medium">฿{dorm.minDoublePrice?.toLocaleString() || dorm.price?.toLocaleString()}</span>
                                            </div>

                                            <div className="h-px bg-border/50 my-2" />

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-primary">You pay</span>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-primary">
                                                        ฿{(dorm.pricePerPerson || (dorm.price / 2))?.toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground ml-1">/person</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Chat Widget */}
            {
                conversation && connectedUserProfile && (
                    <FloatingChat
                        conversation={conversation}
                        connectedUser={connectedUserProfile}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isSendingMessage={isSendingMessage}
                    />
                )
            }
        </section >
    );
}
