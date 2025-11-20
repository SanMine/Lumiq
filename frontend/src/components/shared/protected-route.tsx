import { Navigate } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import Loader from './loader'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <Loader />
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
