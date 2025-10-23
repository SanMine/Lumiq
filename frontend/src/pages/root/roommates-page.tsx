import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function RoommatesPage() {
    const navigate = useNavigate()

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

    return (
        <section className="px-6 py-3">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Roommate Matching Results</h1>

                <div className="space-y-4 overflow-y-scroll">
                    {roommates.map((roommate) => (
                        <div
                            key={roommate.id}
                            className="bg-card rounded-xl p-6 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={roommate.image}
                                    alt={roommate.name}
                                    className="w-16 h-16 rounded-full bg-[#3a3a3a]"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold">{roommate.name}</h3>
                                    <p className="text-gray-400">
                                        Compatibility: <span className="text-green-400 font-semibold">{roommate.compatibility}%</span>
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate(`/roommates/${roommate.id}`)}
                                className="text-white cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30">
                                View Profile
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}