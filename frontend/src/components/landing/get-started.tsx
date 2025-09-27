import { Button } from "../ui/button";

export default function GetStarted() {
    return (
        <section className="py-24 dark:bg-slate-900 bg-slate-50 text-center tracking-wide px-8">
            <h2 className="text-3xl font-bold">Ready to Find Your Community?</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto pb-8 px-4">Our smart matching helps you find roomates who share your lifestyle and interest.</p>
            <Button
                className="px-8 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 font-semibold hover:from-pink-500 hover:via-purple-500 hover:to-blue-400 transition-colors duration-300 w-fit min-h-[40px] text-white cursor-pointer">
                Start Matching
            </Button>
        </section>
    )
}
