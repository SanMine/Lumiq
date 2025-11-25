import Logo from '@/components/shared/logo'
import { Outlet, useLocation } from 'react-router'
import { useEffect, useState } from 'react'
import LumiqLogoReveal from '@/components/animations/LumiqLogoReveal'

export default function AuthRootLayout() {
    const location = useLocation()
    const [isSignUp, setIsSignUp] = useState(false)

    useEffect(() => {
        setIsSignUp(location.pathname === '/auth/sign-up')
    }, [location.pathname])

    return (
        <section className="relative min-h-svh overflow-hidden bg-background">
            {/* Container with two panels */}
            <div className="relative h-screen w-full">
                {/* Form Section */}
                <div
                    className={`absolute inset-y-0 w-full lg:w-1/2 flex flex-col gap-4 p-6 md:p-10 bg-background z-10 transition-all duration-700 ease-in-out ${isSignUp ? 'lg:left-1/2' : 'lg:left-0'
                        }`}
                >
                    <div className="flex justify-center gap-2 md:justify-start">
                        <Logo />
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-sm">
                            {/* Animated form wrapper */}
                            <div
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                key={location.pathname}
                            >
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Section - Lumiq Logo Reveal Animation */}
                <div
                    className={`absolute inset-y-0 w-full lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 hidden lg:flex items-center justify-center transition-all duration-700 ease-in-out ${isSignUp ? 'lg:left-0' : 'lg:left-1/2'
                        }`}
                >
                    {/* Lumiq Morphing Logo Animation */}
                    <LumiqLogoReveal />
                </div>
            </div>
        </section>
    )
}