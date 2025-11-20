import Navbar from "@/components/shared/nav-bar";
import { Outlet, useLocation } from "react-router";

export default function RootLayout() {
    const location = useLocation()
    const isAdminDashboard = location.pathname === '/admin-dashboard'
    
    return (
        <div>
            {!isAdminDashboard && <Navbar />}
            <div className={!isAdminDashboard ? "pt-20 md:pt-24" : ""}>
                <Outlet />
            </div>
        </div>
    )
}
