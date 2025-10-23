import { Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import Loader from './components/shared/loader'
import SignInPage from './pages/auth/sign-in-page'
import SignUpPage from './pages/auth/sign-up-page'
import ErrorElement from './pages/not-found/error-element'
import NotFoundPage from './pages/not-found/not-found-page'
import RootLayout from './pages/root/root-layout'

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
                },
                {
                    path: '/roommate-match',
                    lazy: async () => {
                        const { default: RoommateMatchingPage } = await import('@/pages/root/roommate-matching-page')
                        return { Component: RoommateMatchingPage }
                    }
                },
                {
                    path: "/roommates",
                    lazy: async () => {
                        const { default: RoommatesPage } = await import('@/pages/root/roommates-page')
                        return { Component: RoommatesPage }
                    }
                },
                {
                    path: "/roommates/:id",
                    lazy: async () => {
                        const { default: RoommateDetailPage } = await import('@/pages/root/roommate-detail-page')
                        return { Component: RoommateDetailPage }
                    }
                }
            ]
        },
        {
            path: '/auth',
            lazy: async () => {
                const { default: AuthRootLayout } = await import('@/pages/auth/auth-root-layout')
                return { Component: AuthRootLayout }
            },
            children: [
                {
                    index: true,
                    element: <Navigate to="sign-in" replace />,
                },
                {
                    path: 'sign-in',
                    Component: SignInPage
                },
                {
                    path: 'sign-up',
                    Component: SignUpPage,
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