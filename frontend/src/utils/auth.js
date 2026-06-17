export const getDashboardPath = (role) => {
    const paths = {
        patient: '/patient/dashboard',
        doctor: '/doctor/dashboard',
        assistant: '/assistant/dashboard',
        admin: '/admin/dashboard',
        superadmin: '/admin/dashboard',
    }
    return paths[role] || '/'
}

export const LOGIN_PORTALS = {
    patient: '/login/patient',
    staff: '/login/staff',
    admin: '/login/admin',
}

export const getLoginPath = (role) => {
    if (role === 'patient') return LOGIN_PORTALS.patient
    if (role === 'doctor' || role === 'assistant') return LOGIN_PORTALS.staff
    if (role === 'admin' || role === 'superadmin') return LOGIN_PORTALS.admin
    return '/login'
}

export const getLoginPathForRoute = (pathname = '') => {
    if (pathname.startsWith('/patient')) return LOGIN_PORTALS.patient
    if (pathname.startsWith('/doctor') || pathname.startsWith('/assistant')) return LOGIN_PORTALS.staff
    if (pathname.startsWith('/admin')) return LOGIN_PORTALS.admin
    return '/login'
}
