import Navbar from "@/components/shared/nav-bar";
import { Outlet } from "react-router";

export default function RootLayout() {
    return (
        <div>
            <Navbar />
            <div className="pt-20 md:pt-24">
                <Outlet />
            </div>
        </div>
    )
}
