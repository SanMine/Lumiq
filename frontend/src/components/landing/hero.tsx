import { Typewriter } from "../ui/typewriter"

export default function Hero() {
    return (
        <section className="py-32 px-8 flex flex-col gap-6 items-center tracking-wide">
            <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold">
                Find Your Perfect{" "}
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-lime-600 dark:from-pink-400 dark:via-purple-400 dark:to-lime-400 bg-clip-text text-transparent">
                    <Typewriter
                        words={["Dorm & Roommate", "Living Space", "Dormitory"]}
                        typingSpeed={120}
                        deletingSpeed={80}
                        delayBetweenWords={2500}
                    />
                </span>
            </h1>
            <h3 className="max-w-lg text-center text-sm md:text-base">
                Match with compatible roommates using AI-powered personality analysis. Find your perfect dorm, faster.
            </h3>
        </section>
    )
}
