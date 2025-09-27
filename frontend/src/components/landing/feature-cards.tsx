import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cards } from "@/lib/constants"

export default function FeatureCards() {
    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-2 md:gap-4 lg:gap-6 my-6 px-8">
            {
                cards.map(card => (
                    <Card key={card.title} className="w-full rounded-md">
                        <CardHeader className="text-center">
                            <CardTitle className="md:text-lg">{card.title}</CardTitle>
                            <CardDescription>{card.subTitle}</CardDescription>
                        </CardHeader>
                    </Card>
                ))
            }
        </div>
    )
}
