import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getDashboardPath } from '../utils/auth'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

const AuthContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
    })
    const [loading, setLoading] = useState(false)

    const persistAuth = (authToken, authUser) => {
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(authUser))
        setToken(authToken)
        setUser(authUser)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken('')
        setUser(null)
    }

    const register = async (name, email, password, role) => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
                name, email, password, role,
            })
            if (data.success) {
                persistAuth(data.token, data.user)
                toast.success('Account created successfully')
                return { success: true, redirectTo: getDashboardPath(data.user.role) }
            }
            toast.error(data.message)
            return { success: false, message: data.message }
        } catch (error) {
            const message = error.response?.data?.message || error.message
            toast.error(message)
            return { success: false, message }
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password, allowedRoles, wrongPortalMessage) => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password })
            if (data.success) {
                if (allowedRoles?.length && !allowedRoles.includes(data.user.role)) {
                    const message = wrongPortalMessage || 'This account cannot sign in here. Please use the correct portal.'
                    toast.error(message)
                    return { success: false, message }
                }
                persistAuth(data.token, data.user)
                toast.success('Welcome back!')
                return { success: true, redirectTo: getDashboardPath(data.user.role) }
            }
            toast.error(data.message)
            return { success: false, message: data.message }
        } catch (error) {
            const message = error.response?.data?.message || error.message
            toast.error(message)
            return { success: false, message }
        } finally {
            setLoading(false)
        }
    }

    const forgotPassword = async (email) => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/forgot-password`, { email })
            if (data.success) {
                toast.success(data.message)
                return { success: true, resetLink: data.resetLink }
            }
            toast.error(data.message)
            return { success: false, message: data.message }
        } catch (error) {
            const message = error.response?.data?.message || error.message
            toast.error(message)
            return { success: false, message }
        } finally {
            setLoading(false)
        }
    }

    const resetPassword = async (token, password) => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { token, password })
            if (data.success) {
                toast.success(data.message)
                return { success: true }
            }
            toast.error(data.message)
            return { success: false, message: data.message }
        } catch (error) {
            const message = error.response?.data?.message || error.message
            toast.error(message)
            return { success: false, message }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!token) {
            setUser(null)
        }
    }, [token])

    const value = {
        backendUrl,
        token,
        user,
        loading,
        isAuthenticated: Boolean(token && user),
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        getDashboardPath,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider
