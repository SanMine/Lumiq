import Logo from '@/components/shared/logo'
import limuqGif from '@/images/limuq.gif'
import { Outlet, useLocation } from 'react-router'
import { useEffect, useState } from 'react'

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

                {/* Image Section */}
                <div
                    className={`absolute inset-y-0 w-full lg:w-1/2 bg-[#f0f0f1] hidden lg:block transition-all duration-700 ease-in-out ${isSignUp ? 'lg:left-0' : 'lg:left-1/2'}`}      >
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 z-10" />

                    {/* Main image with animations */}
                    <div
                        className="h-full w-full flex items-center justify-center"
                        key={isSignUp ? 'signup' : 'signin'}
                    >
                        <img
                            src={limuqGif}
                            alt="Auth Background"
                            className="max-w-[70%] max-h-[70%] object-contain relative z-0"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
