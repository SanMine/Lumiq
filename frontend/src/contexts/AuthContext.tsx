import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService } from '@/api'

interface User {
    _id?: number
    id: string
    email: string
    name: string
    role: string
    phone?: string
    dateOfBirth?: string
    address?: string
    bio?: string
    dormId?: number
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string, role?: string) => Promise<void>
    logout: () => void
    setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token')
            if (storedToken) {
                try {
                    setToken(storedToken)
                    const response = await authService.getCurrentUser(storedToken)
                    if (response.success && response.user) {
                        setUser(response.user)
                        localStorage.setItem('user', JSON.stringify(response.user))
                    } else {
                        throw new Error('Failed to verify token')
                    }
                } catch (error) {
                    console.error('Auth initialization error:', error)
                    logout()
                }
            }
            setIsLoading(false)
        }

        initAuth()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login(email, password)

            if (response.success && response.token && response.user) {
                setToken(response.token)
                setUser(response.user)
                localStorage.setItem('token', response.token)
                localStorage.setItem('user', JSON.stringify(response.user))
            } else {
                throw new Error(response.message || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const register = async (name: string, email: string, password: string, role: string = 'student') => {
        try {
            const response = await authService.register(name, email, password, role)

            if (response.success && response.token && response.user) {
                setToken(response.token)
                setUser(response.user)
                localStorage.setItem('token', response.token)
                localStorage.setItem('user', JSON.stringify(response.user))
            } else {
                throw new Error(response.message || 'Registration failed')
            }
        } catch (error) {
            console.error('Registration error:', error)
            throw error
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    const updateUser = (updatedUser: User | null) => {
        setUser(updatedUser)
        if (updatedUser) {
            localStorage.setItem('user', JSON.stringify(updatedUser))
        }
    }

    const value = {
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        setUser: updateUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
