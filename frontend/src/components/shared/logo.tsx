import { APP_NAME } from "@/lib/constants";
import { SiLogseq } from "react-icons/si";

export default function Logo() {
    return (
        <div className="flex items-center gap-4 mb-6">
            <SiLogseq className='size-5' />
            <h1 className="text-xl font-bold tracking-wider dark:bg-gradient-to-r dark:from-purple-400 dark:via-pink-500 dark:to-blue-500 dark:bg-clip-text dark:text-transparent">
                {APP_NAME}
            </h1>
        </div>
    )
}
