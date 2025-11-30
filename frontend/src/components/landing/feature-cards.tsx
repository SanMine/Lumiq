import { cards } from "@/lib/constants"
import { useNavigate } from "react-router"
import { ArrowRight, Home, Users } from "lucide-react"
import { useState } from "react"

export default function FeatureCards() {
    const navigate = useNavigate();
    const [activeCard, setActiveCard] = useState<string | null>(null);

    const getIcon = (title: string) => {
        if (title.includes("Dorm")) return <Home className="w-6 h-6 md:w-7 md:h-7" />;
        if (title.includes("Roommate")) return <Users className="w-6 h-6 md:w-7 md:h-7" />;
        return null;
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-6 my-8 px-4 md:px-8">
            {
                cards.map(card => (
                    <button
                        key={card.title}
                        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-lime-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-lime-500/20 p-[2px] shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/20 active:scale-[0.98]"
                        onClick={() => {
                            setActiveCard(card.title);
                            setTimeout(() => navigate(card.to), 150);
                        }}
                        onMouseEnter={() => setActiveCard(card.title)}
                        onMouseLeave={() => setActiveCard(null)}
                    >
                        {/* Animated gradient border */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-lime-500 opacity-0 blur-xl transition-opacity duration-500 ${activeCard === card.title ? 'opacity-30' : ''}`} />

                        {/* Main content */}
                        <div className="relative h-full w-full rounded-2xl bg-background px-5 py-6 md:py-7 flex flex-col items-center gap-3 text-center">

                            {/* Icon container with floating animation */}
                            <div className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg transition-all duration-500 ${activeCard === card.title ? 'rotate-12 scale-110 shadow-2xl shadow-pink-500/50' : 'rotate-0 scale-100'}`}>
                                {getIcon(card.title)}
                            </div>

                            {/* Animated label tag */}
                            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-lime-500 to-green-500 text-white text-xs font-semibold shadow-md transition-all duration-300 ${activeCard === card.title ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`}>
                                Click to explore
                            </div>

                            {/* Title with gradient */}
                            <div className="space-y-2">
                                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-lime-600 dark:from-pink-400 dark:via-purple-400 dark:to-lime-400 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                                    {card.title}
                                </h3>
                                <p className="text-sm md:text-base text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                                    {card.subTitle}
                                </p>
                            </div>

                            {/* Arrow icon with animation */}
                            <div className={`flex items-center gap-2 text-sm font-medium text-pink-600 dark:text-pink-400 transition-all duration-300 ${activeCard === card.title ? 'translate-x-2' : 'translate-x-0'}`}>
                                Get Started
                                <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${activeCard === card.title ? 'translate-x-1' : 'translate-x-0'}`} />
                            </div>

                            {/* Pulse effect on hover */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/5 to-purple-500/5 transition-opacity duration-300 ${activeCard === card.title ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
                        </div>
                    </button>
                ))
            }
        </div>
    )
}