import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";

export default function RoommatesPage() {
    const navigate = useNavigate();

    const roommates = [
        {
            id: 1,
            name: "Sophia Clark",
            compatibility: 95,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia"
        },
        {
            id: 2,
            name: "Ethan Miller",
            compatibility: 88,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan"
        },
        {
            id: 3,
            name: "Olivia Davis",
            compatibility: 75,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia"
        },
        {
            id: 4,
            name: "Noah Wilson",
            compatibility: 60,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah"
        }
    ];

    const getCompatibilityColor = (compatibility: number) => {
        if (compatibility >= 90) return "text-green-500 dark:text-green-400";
        if (compatibility >= 75) return "text-cyan-500 dark:text-cyan-400";
        if (compatibility >= 60) return "text-lime-500 dark:text-lime-400";
        return "text-yellow-500 dark:text-yellow-400";
    };

    return (
        <section className="min-h-screen bg-background px-6 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground text-center">
                    Roommate Matching Results
                </h1>

                <div className="space-y-4">
                    {roommates.map((roommate) => (
                        <Card
                            key={roommate.id}
                            className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-lg transition-all duration-300 border border-border bg-card"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={roommate.image}
                                        alt={roommate.name}
                                        className="w-16 h-16 rounded-full bg-muted ring-2 ring-border"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground">
                                        {roommate.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Compatibility:{" "}
                                        <span className={`font-semibold ${getCompatibilityColor(roommate.compatibility)}`}>
                                            {roommate.compatibility}%
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate(`/roommates/${roommate.id}`)}
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