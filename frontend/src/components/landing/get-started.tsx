import { useNavigate } from "react-router";
import { Button } from "../ui/button";

export default function GetStarted() {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate('/roommate-match')
    }

    return (
        <section className="py-24 dark:bg-slate-900 bg-slate-50 text-center tracking-wide px-8">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Find Your Community?</h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-lg mx-auto pb-8 px-4 pt-2">Our smart matching helps you find roomates who share your lifestyle and interest.</p>
            <Button
                onClick={handleClick}
                className="px-8 rounded-full bg-gradient w-fit min-h-[40px] text-white cursor-pointer">
                Start Matching
            </Button>
        </section>
    )
}
