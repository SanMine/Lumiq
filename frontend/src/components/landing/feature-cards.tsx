import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const cards = [
    {
        title: "Explore Dorms",
        subTitle: "Browse our extensive list of student housing options."
    },
    {
        title: "Roommate Matching",
        subTitle: "Find compatible roommates with our smart algorithm."
    }
]

export default function FeatureCards() {
    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-2 md:gap-4 lg:gap-6 my-12">
            {
                cards.map(card => (
                    <Card key={card.title} className="w-full">
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
