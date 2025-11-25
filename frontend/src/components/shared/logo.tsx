import icon from "@/images/icon.png";

export default function Logo() {
    return (
        <div className="flex items-center gap-4 mb-6">
            <img src={icon} alt="Lumiq Logo" className="w-32 h-auto object-contain" />
        </div>
    )
}
