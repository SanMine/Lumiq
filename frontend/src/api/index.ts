import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

// Add JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = `/auth/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`
        }
        return Promise.reject(error)
    }
)

export const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

// Authentication APIs
export const authService = {
    login: async (email: string, password: string) => {
        const response = await authApi.post('/auth/login', { email, password })
        return response.data
    },
    
    register: async (name: string, email: string, password: string, role: string = 'student') => {
        const response = await authApi.post('/auth/register', { 
            name, 
            email, 
            password,
            role
        })
        return response.data
    },
    
    getCurrentUser: async (token: string) => {
        const response = await authApi.get('/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    }
}

export default api