import { cards } from "@/lib/constants"
import { useNavigate } from "react-router"

export default function FeatureCards() {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-2 md:gap-4 lg:gap-6 my-6 px-8">
            {
                cards.map(card => (
                    <div 
                        key={card.title} 
                        className="w-full rounded-md border p-6 flex flex-col items-center gap-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" 
                        onClick={() => navigate(card.to)}
                    >
                        <div className="text-center">
                            <h3 className="md:text-lg font-bold">{card.title}</h3>
                            <p className="text-sm text-muted-foreground">{card.subTitle}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}