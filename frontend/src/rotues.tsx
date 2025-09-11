import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './pages/root/root-layout'
import Loader from './components/shared/loader'
import ErrorElement from './pages/not-found/error-element'
import LoginPage from './pages/auth/login-page'
import RegisterPage from './pages/auth/register-page'
import NotFoundPage from './pages/not-found/not-found-page'


export default function Router() {
    const router = createBrowserRouter([
        {
            path: "/",
            Component: RootLayout,
            errorElement: <ErrorElement />,
            children: [
                {
                    index: true,
                    lazy: async () => {
                        const { default: HomePage } = await import("@/pages/root/home-page")
                        return { Component: HomePage }
                    },
                }
            ]
        },
        {
            path: '/login',
            Component: LoginPage,
        },
        {
            path: '/register',
            lazy: async () => {
                const { default: AuthRootLayout } = await import('@/pages/auth/auth-root-layout')
                return { Component: AuthRootLayout }
            },
            children: [
                {
                    index: true,
                    Component: RegisterPage,
                },
            ]
        },
        {
            path: '*',
            Component: NotFoundPage
        }
    ])

    return (
        <Suspense fallback={<Loader />}>
            <RouterProvider router={router} />
        </Suspense>
    )
}