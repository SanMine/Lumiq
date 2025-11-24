import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Message {
    id: number
    text: string
    sender: "user" | "bot"
    timestamp: Date
}

const initialMessages: Message[] = [
    {
        id: 1,
        text: "Hi! I'm Lumiq's assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date()
    }
]

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = () => {
        if (!inputValue.trim()) return

        const userMessage: Message = {
            id: messages.length + 1,
            text: inputValue,
            sender: "user",
            timestamp: new Date()
        }

        setMessages([...messages, userMessage])
        setInputValue("")
        setIsTyping(true)

        // Simulate bot response
        setTimeout(() => {
            const botMessage: Message = {
                id: messages.length + 2,
                text: getBotResponse(inputValue),
                sender: "bot",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botMessage])
            setIsTyping(false)
        }, 1000 + Math.random() * 1000)
    }

    const getBotResponse = (userInput: string): string => {
        const input = userInput.toLowerCase()

        if (input.includes("hello") || input.includes("hi")) {
            return "Hello! How can I assist you with finding your perfect dorm or roommate today?"
        } else if (input.includes("dorm") || input.includes("room")) {
            return "Great! We have many dorm listings available. Would you like to see featured dorms or search for specific amenities?"
        } else if (input.includes("roommate")) {
            return "Our AI-powered roommate matching system can help you find compatible roommates based on your preferences. Would you like to start the matching process?"
        } else if (input.includes("help")) {
            return "I can help you with:\n• Finding dorm listings\n• Roommate matching\n• Booking information\n• Account management\n\nWhat would you like to know more about?"
        } else if (input.includes("price") || input.includes("cost")) {
            return "Dorm prices vary based on location and amenities. Most start from ฿3,000/month. Would you like to see available options in your budget?"
        } else {
            return "I'm here to help! You can ask me about dorms, roommates, pricing, or booking. What would you like to know?"
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <>
            {/* Floating Chat Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="icon"
                    className={cn(
                        "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
                        "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
                        "hover:scale-110 active:scale-95",
                        isOpen && "rotate-90"
                    )}
                >
                    {isOpen ? (
                        <X className="h-6 w-6 text-white" />
                    ) : (
                        <MessageCircle className="h-6 w-6 text-white" />
                    )}
                </Button>
            </div>

            {/* Chat Window */}
            <div
                className={cn(
                    "fixed bottom-24 right-6 z-50 w-[380px] transition-all duration-300 ease-in-out",
                    isOpen
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                )}
            >
                <Card className="flex flex-col h-[500px] shadow-2xl border-2 border-border overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white">
                            <AvatarFallback className="bg-white text-purple-600">
                                <Bot className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg">Lumiq Assistant</h3>
                            <p className="text-white/80 text-xs">Always here to help</p>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                        {messages.map((message, index) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                    message.sender === "user" ? "justify-end" : "justify-start"
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {message.sender === "bot" && (
                                    <Avatar className="h-8 w-8 mt-1">
                                        <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600">
                                            <Bot className="h-4 w-4 text-white" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={cn(
                                        "max-w-[75%] rounded-2xl px-4 py-2 transition-all duration-200",
                                        message.sender === "user"
                                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                                            : "bg-card border border-border"
                                    )}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    <span
                                        className={cn(
                                            "text-[10px] mt-1 block",
                                            message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                                        )}
                                    >
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                </div>
                                {message.sender === "user" && (
                                    <Avatar className="h-8 w-8 mt-1">
                                        <AvatarFallback className="bg-muted">
                                            <User className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                                <Avatar className="h-8 w-8 mt-1">
                                    <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600">
                                        <Bot className="h-4 w-4 text-white" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-card border border-border rounded-2xl px-4 py-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-background border-t border-border">
                        <div className="flex gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 focus-visible:ring-purple-500"
                            />
                            <Button
                                onClick={handleSendMessage}
                                size="icon"
                                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 active:scale-95"
                                disabled={!inputValue.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}
