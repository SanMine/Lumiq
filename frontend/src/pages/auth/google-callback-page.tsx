import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import Loader from '@/components/shared/loader'
import { toast } from 'sonner'
import { authService } from '@/api'

export default function GoogleCallbackPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { setUser } = useAuth()
    const [error, setError] = useState('')

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const token = searchParams.get('token')
            const errorParam = searchParams.get('error')

            // Check for error from backend
            if (errorParam) {
                toast.error('Google sign-in failed. Please try again.')
                navigate('/auth/sign-in')
                return
            }

            // Check for token
            if (!token) {
                setError('No authentication token received')
                toast.error('Authentication failed')
                setTimeout(() => navigate('/auth/sign-in'), 2000)
                return
            }

            try {
                // Store the token
                localStorage.setItem('token', token)

                // Fetch user information
                const response = await authService.getCurrentUser(token)

                if (response.success && response.user) {
                    setUser(response.user)
                    localStorage.setItem('user', JSON.stringify(response.user))

                    toast.success('Successfully signed in with Google!')

                    // Role-based redirect
                    if (response.user.role === 'dorm_admin') {
                        navigate('/admin-dashboard')
                    } else {
                        navigate('/')
                    }
                } else {
                    throw new Error('Failed to fetch user information')
                }
            } catch (err) {
                console.error('Google callback error:', err)
                setError('Failed to complete sign-in')
                toast.error('Authentication failed. Please try again.')
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setTimeout(() => navigate('/auth/sign-in'), 2000)
            }
        }

        handleGoogleCallback()
    }, [searchParams, navigate, setUser])

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error}</p>
                    <p className="text-muted-foreground">Redirecting to sign in...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <Loader />
                <p className="mt-4 text-muted-foreground">Completing Google sign-in...</p>
            </div>
        </div>
    )
}
