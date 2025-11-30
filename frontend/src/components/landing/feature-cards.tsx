import { cards } from "@/lib/constants";
import { useNavigate } from "react-router";
import { Home, Users, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function FeatureCards() {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const getIcon = (title: string) => {
        if (title.includes("Dorm")) return <Home className="w-6 h-6" />;
        if (title.includes("Roommate")) return <Users className="w-6 h-6" />;
        return null;
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-stretch gap-6 my-16 px-4 md:px-8">
            {
                cards.map(card => {
                    const isHovered = hoveredCard === card.title;

                    return (
                        <motion.div
                            key={card.title}
                            className="relative flex-1"
                            data-testid={`${card.title.toLowerCase().replace(/\s+/g, '-')}-card`}
                            onMouseEnter={() => setHoveredCard(card.title)}
                            onMouseLeave={() => setHoveredCard(null)}
                            whileHover={{ y: -6 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {/* Strong glow on hover for button feel */}
                            <motion.div
                                className="absolute -inset-[2px] rounded-2xl bg-foreground/10 blur-lg"
                                animate={{
                                    opacity: isHovered ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                            />

                            {/* Main card button */}
                            <Card
                                className={cn(
                                    "relative h-full cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 group",
                                    "border-2",
                                    isHovered
                                        ? "border-white dark:border-gray-700 bg-white dark:bg-gray-950 shadow-2xl"
                                        : "border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 shadow-lg"
                                )}
                                onClick={() => navigate(card.to)}
                            >
                                {/* Animated background on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-pink-500/[0.08] via-purple-500/[0.06] to-pink-500/[0.04]"
                                    animate={{
                                        opacity: isHovered ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Card content */}
                                <div className="relative p-5 md:p-6 flex flex-col gap-3 h-full min-h-[220px]">

                                    {/* Icon with subtle color accent */}
                                    <motion.div
                                        className="flex items-center justify-center w-12 h-12 rounded-xl border-2 bg-background"
                                        animate={{
                                            borderColor: isHovered ? "rgb(236 72 153 / 0.5)" : "hsl(var(--foreground) / 0.15)",
                                            backgroundColor: isHovered ? "rgb(236 72 153 / 0.05)" : "hsl(var(--background))",
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.div
                                            className={isHovered ? "text-pink-500" : ""}
                                            animate={{
                                                scale: isHovered ? 1.15 : 1,
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {getIcon(card.title)}
                                        </motion.div>
                                    </motion.div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col gap-2">
                                        <h3 className="text-lg md:text-xl font-medium tracking-tight">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {card.subTitle}
                                        </p>
                                    </div>

                                    {/* Strong CTA indicator */}
                                    <motion.div
                                        className="flex items-center gap-3 pt-3 border-t"
                                        animate={{
                                            borderColor: isHovered ? "rgb(236 72 153 / 0.2)" : "hsl(var(--foreground) / 0.08)",
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.span
                                            className="text-xs font-medium tracking-wide"
                                            animate={{
                                                opacity: isHovered ? 1 : 0.7,
                                                color: isHovered ? "rgb(236 72 153)" : "hsl(var(--foreground))",
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            Click to explore
                                        </motion.span>
                                        <motion.div
                                            className="flex items-center justify-center w-7 h-7 rounded-full border"
                                            animate={{
                                                x: isHovered ? 6 : 0,
                                                borderColor: isHovered ? "rgb(236 72 153)" : "hsl(var(--foreground) / 0.15)",
                                                backgroundColor: isHovered ? "rgb(236 72 153 / 0.1)" : "transparent",
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ArrowRight className={cn("w-3.5 h-3.5", isHovered && "text-pink-500")} />
                                        </motion.div>
                                    </motion.div>

                                    {/* Clickable indicator badge with subtle color */}
                                    <motion.div
                                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full border text-xs font-medium"
                                        animate={{
                                            borderColor: isHovered ? "rgb(168 85 247 / 0.4)" : "hsl(var(--foreground) / 0.15)",
                                            backgroundColor: isHovered ? "rgb(168 85 247 / 0.08)" : "hsl(var(--background))",
                                            color: isHovered ? "rgb(168 85 247)" : "hsl(var(--foreground))",
                                            scale: isHovered ? 1.05 : 1,
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Core Feature
                                    </motion.div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })
            }
        </div>
    );
}