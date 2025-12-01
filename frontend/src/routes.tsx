import { Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import Loader from './components/shared/loader'
import SignInPage from './pages/auth/sign-in-page'
import SignUpPage from './pages/auth/sign-up-page'
import ErrorElement from './pages/not-found/error-element'
import NotFoundPage from './pages/not-found/not-found-page'
import RootLayout from './pages/root/root-layout'
import ProtectedRoute from './components/shared/protected-route'

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
          path: '/dorms',
          lazy: async () => {
            const { default: AllDorms } = await import('@/pages/root/all-dorms-page')
            return { Component: AllDorms }
          }
        },
        {
          path: '/dorms/:id',
          lazy: async () => {
            const { default: DormDetail } = await import('@/pages/root/dorm-detail-page')
            return { Component: DormDetail }
          }
        },
        {
          path: '/dorms/:id/rooms/:roomId',
          lazy: async () => {
            const { default: RoomDetail } = await import('@/pages/root/room-detail-page')
            return { Component: RoomDetail }
          }
        },
        {
          path: '/dorms/:id/book',
          lazy: async () => {
            const { default: RoomBooking } = await import('@/pages/root/room-booking')
            return {
              Component: () => (
                <ProtectedRoute excludedRoles={['dorm_admin']}>
                  <RoomBooking />
                </ProtectedRoute>
              )
            }
          }
        },
        {
          path: '/roommate-match',
          lazy: async () => {
            const { default: RoommateMatchingPage } = await import('@/pages/root/roommate-matching-page')
            return {
              Component: () => (
                <ProtectedRoute excludedRoles={['dorm_admin']}>
                  <RoommateMatchingPage />
                </ProtectedRoute>
              )
            }
          }
        },
        {
          path: "/roommates",
          lazy: async () => {
            const { default: RoommatesPage } = await import('@/pages/root/roommates-page')
            return {
              Component: () => (
                <ProtectedRoute excludedRoles={['dorm_admin']}>
                  <RoommatesPage />
                </ProtectedRoute>
              )
            }
          }
        },
        {
          path: "/roommates/:id",
          lazy: async () => {
            const { default: RoommateDetailPage } = await import('@/pages/root/roommate-detail-page')
            return {
              Component: () => (
                <ProtectedRoute excludedRoles={['dorm_admin']}>
                  <RoommateDetailPage />
                </ProtectedRoute>
              )
            }
          }
        },
        {
          path: "/knockknock",
          lazy: async () => {
            const { default: KnockKnockPage } = await import('@/pages/root/knockknock-page')
            return {
              Component: () => (
                <ProtectedRoute excludedRoles={['dorm_admin']}>
                  <KnockKnockPage />
                </ProtectedRoute>
              )
            }
          }
        },
        {
          path: "/connection/:userId",
          lazy: async () => {
            const { default: ConnectionPage } = await import('@/pages/root/connection-page')
            return {
              Component: () => (
                <ProtectedRoute excludedRoles={['dorm_admin']}>
                  <ConnectionPage />
                </ProtectedRoute>
              )
            }
          }
        },
        {
          path: "/account",
          lazy: async () => {
            const { default: MyAccountPage } = await import('@/pages/root/my-account-page')
            return { Component: MyAccountPage }
          }
        },
        {
          path: "/wishlist",
          lazy: async () => {
            const { default: WishlistPage } = await import('@/pages/root/wishlist-page')
            return { Component: WishlistPage }
          }
        },
        {
          path: "/privacy-policy",
          lazy: async () => {
            const { default: PrivacyPolicyPage } = await import('@/pages/root/privacy-policy-page')
            return { Component: PrivacyPolicyPage }
          }
        },
        {
          path: "/admin-dashboard",
          lazy: async () => {
            const { default: AdminDashboard } = await import('@/pages/root/admin-dashboard')
            return {
              Component: () => (
                <ProtectedRoute requiredRole="dorm_admin">
                  <AdminDashboard />
                </ProtectedRoute>
              )
            }
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
      path: '/forgot-password',
      lazy: async () => {
        const { default: ForgotPasswordPage } = await import('@/pages/auth/forgot-password-page')
        return { Component: ForgotPasswordPage }
      },
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