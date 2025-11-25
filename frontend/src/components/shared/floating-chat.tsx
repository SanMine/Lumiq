import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Maximize2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api";

interface UserProfile {
    _id: number;
    name: string;
    email: string;
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

interface Conversation {
    _id: number;
    participants: number[];
    lastMessage: string;
    lastMessageAt: string;
}

interface FloatingChatProps {
    conversation: Conversation | null;
    connectedUser: UserProfile;
    messages: Message[];
    onSendMessage: (text: string) => Promise<void>;
    isSendingMessage: boolean;
}

type ChatState = 'hidden' | 'minimized' | 'maximized';

export default function FloatingChat({
    conversation,
    connectedUser,
    messages,
    onSendMessage,
    isSendingMessage
}: FloatingChatProps) {
    const { user } = useAuth();
    const [chatState, setChatState] = useState<ChatState>('hidden');
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (chatState !== 'hidden') {
            scrollToBottom();
        }
    }, [messages, chatState]);

    // Track active chat session - notify backend when chat is opened/closed
    useEffect(() => {
        if (!conversation) return;

        const isActive = chatState === 'minimized' || chatState === 'maximized';

        if (isActive) {
            // Mark conversation as active
            api.post('/chat-sessions/active', { conversationId: conversation._id })
                .then(() => {
                    console.log(`✅ Chat session activated for conversation ${conversation._id}`);
                })
                .catch(error => {
                    console.error('Failed to activate chat session:', error);
                });
        } else {
            // Mark conversation as inactive when hidden
            api.delete(`/chat-sessions/active/${conversation._id}`)
                .then(() => {
                    console.log(`🔒 Chat session deactivated for conversation ${conversation._id}`);
                })
                .catch(error => {
                    console.error('Failed to deactivate chat session:', error);
                });
        }

        // Cleanup: always deactivate on unmount
        return () => {
            if (conversation) {
                api.delete(`/chat-sessions/active/${conversation._id}`)
                    .catch(error => {
                        console.error('Failed to cleanup chat session:', error);
                    });
            }
        };
    }, [chatState, conversation]);

    // Get unread message count
    const getUnreadCount = () => {
        const currentUserId = user?._id || user?.id;
        if (!currentUserId) return 0;

        return messages.filter(
            msg => msg.sender._id !== currentUserId && !msg.readBy.includes(Number(currentUserId))
        ).length;
    };

    const unreadCount = getUnreadCount();

    const handleSendMessage = async () => {
        if (!newMessage.trim() || isSendingMessage) return;

        const messageText = newMessage.trim();
        setNewMessage("");

        try {
            await onSendMessage(messageText);
        } catch (error) {
            // Error handling is done in parent component
            console.error("Error sending message:", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!conversation) return null;

    const currentUserId = user?._id || user?.id;

    return (
        <>
            {/* Floating Chat Icon */}
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setChatState(chatState === 'hidden' ? 'minimized' : 'hidden')}
                    size="icon"
                    className={cn(
                        "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
                        "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
                        "hover:scale-110 active:scale-95",
                        chatState === 'hidden' && "animate-bounce"
                    )}
                >
                    <MessageCircle className="h-6 w-6 text-white" />
                    {unreadCount > 0 && chatState === 'hidden' && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center animate-pulse"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* Chat Window */}
            <div
                className={cn(
                    "fixed z-50 transition-all duration-300 ease-in-out",
                    chatState === 'minimized' && "bottom-24 right-6 w-[400px] h-[500px] opacity-100 scale-100",
                    chatState === 'maximized' && "bottom-24 right-6 w-[600px] h-[700px] opacity-100 scale-100",
                    chatState === 'hidden' && "bottom-24 right-6 opacity-0 scale-95 pointer-events-none"
                )}
            >
                <Card className="flex flex-col h-full shadow-2xl border border-border overflow-hidden rounded-2xl p-0 gap-0">
                    {/* Header */}
                    <CardHeader className="border-b border-border bg-gradient-to-r from-pink-500 to-purple-600 p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-full bg-white p-0.5">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${connectedUser.name}`}
                                        alt={connectedUser.name}
                                        className="w-full h-full rounded-full"
                                    />
                                </div>
                                <div>
                                    <CardTitle className="text-white text-base font-medium leading-none">
                                        {connectedUser.name}
                                    </CardTitle>
                                    <p className="text-white/80 text-[10px] mt-0.5">
                                        {connectedUser.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {chatState === 'minimized' && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
                                        onClick={() => setChatState('maximized')}
                                    >
                                        <Maximize2 className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                                {chatState === 'maximized' && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
                                        onClick={() => setChatState('minimized')}
                                    >
                                        <Minimize2 className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
                                    onClick={() => setChatState('hidden')}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    {/* Messages List */}
                    <CardContent className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/30">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                                <MessageCircle className="w-12 h-12 mb-2" />
                                <p className="text-sm">
                                    No messages yet. Say hi! 👋
                                </p>
                            </div>
                        ) : (
                            messages.map((message) => {
                                const isCurrentUser = message.sender._id === currentUserId;
                                return (
                                    <div
                                        key={message._id}
                                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${isCurrentUser
                                                ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-tr-none'
                                                : 'bg-white dark:bg-card border border-border text-foreground rounded-tl-none'
                                                }`}
                                        >
                                            {!isCurrentUser && (
                                                <p className="text-[10px] font-bold mb-0.5 opacity-70 text-primary">
                                                    {message.sender.name}
                                                </p>
                                            )}
                                            <p className="text-sm break-words leading-relaxed">{message.text}</p>
                                            <p
                                                className={`text-[10px] mt-1 text-right ${isCurrentUser ? 'text-white/70' : 'text-muted-foreground'
                                                    }`}
                                            >
                                                {new Date(message.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Message Input */}
                    <div className="border-t border-border p-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 text-sm border border-border rounded-full bg-muted/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-muted-foreground/70"
                                disabled={isSendingMessage}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || isSendingMessage}
                                size="icon"
                                className="h-9 w-9 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md transition-transform hover:scale-105 active:scale-95"
                            >
                                <Send className="h-4 w-4 text-white" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
}
