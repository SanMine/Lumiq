import { Navigate } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import Loader from './loader'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  excludedRoles?: string[]
}

export default function ProtectedRoute({
  children,
  requiredRole,
  excludedRoles = []
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <Loader />
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  if (excludedRoles.length > 0 && excludedRoles.includes(user.role)) {
    const redirectPath = user.role === 'dorm_admin' ? '/admin-dashboard' : '/'
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}
