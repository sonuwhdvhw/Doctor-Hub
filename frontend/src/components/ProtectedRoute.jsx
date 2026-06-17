import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getLoginPathForRoute } from '../utils/auth'

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth()
    const location = useLocation()

    if (!isAuthenticated) {
        const loginPath = getLoginPathForRoute(location.pathname)
        return <Navigate to={loginPath} state={{ from: location }} replace />
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to='/unauthorized' replace />
    }

    return children
}

export default ProtectedRoute
