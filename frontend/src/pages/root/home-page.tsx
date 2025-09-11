import { Card, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function HomePage() {
    return (
        <section className="py-16 px-8 flex flex-col gap-6 items-center">
            <h1 className="text-center text-5xl font-bold">Find Your Perfect Dorm & Roomate</h1>
            <h3 className="max-w-lg text-center">
                Discover the ideal living space and connect with compatible roomates effortlessly.
                Your college journey starts here!
            </h3>
            <div className="w-full max-w-5xl mx-auto flex items-center gap-3 my-12">
                {
                    cards.map(card => (
                        <Card key={card.title} className="p-6 mb-4 w-full">
                            <CardHeader>
                                <CardTitle>{card.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{card.subTitle}</p>
                            </CardHeader>
                        </Card>
                    ))
                }
            </div>
        </section>
    )
}
