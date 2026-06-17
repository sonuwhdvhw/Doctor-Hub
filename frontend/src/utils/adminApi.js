import axios from 'axios'

const getAuthHeaders = (token) => ({
    headers: { Authorization: `Bearer ${token}`, token },
})

export const adminApi = {
    getAnalytics: (url, token) => axios.get(`${url}/api/admin/analytics`, getAuthHeaders(token)),
    getDoctors: (url, token) => axios.get(`${url}/api/admin/doctors`, getAuthHeaders(token)),
    createDoctor: (url, token, payload) => axios.post(`${url}/api/admin/doctors`, payload, getAuthHeaders(token)),
    updateDoctor: (url, token, id, payload) => axios.put(`${url}/api/admin/doctors/${id}`, payload, getAuthHeaders(token)),
    deleteDoctor: (url, token, id) => axios.delete(`${url}/api/admin/doctors/${id}`, getAuthHeaders(token)),
    verifyDoctor: (url, token, id) => axios.put(`${url}/api/admin/doctors/${id}/verify`, {}, getAuthHeaders(token)),
    unverifyDoctor: (url, token, id) => axios.put(`${url}/api/admin/doctors/${id}/unverify`, {}, getAuthHeaders(token)),
    getAssistants: (url, token) => axios.get(`${url}/api/admin/assistants`, getAuthHeaders(token)),
    createAssistant: (url, token, payload) => axios.post(`${url}/api/admin/assistants`, payload, getAuthHeaders(token)),
    updateAssistant: (url, token, id, payload) => axios.put(`${url}/api/admin/assistants/${id}`, payload, getAuthHeaders(token)),
    deleteAssistant: (url, token, id) => axios.delete(`${url}/api/admin/assistants/${id}`, getAuthHeaders(token)),
    getPatients: (url, token) => axios.get(`${url}/api/admin/patients`, getAuthHeaders(token)),
    getAppointments: (url, token, params) => axios.get(`${url}/api/admin/appointments`, { ...getAuthHeaders(token), params }),
    getPayments: (url, token) => axios.get(`${url}/api/admin/payments`, getAuthHeaders(token)),
}

export const superAdminApi = {
    getAdmins: (url, token) => axios.get(`${url}/api/superadmin/admins`, getAuthHeaders(token)),
    promoteAdmin: (url, token, email) => axios.post(`${url}/api/superadmin/admins`, { email }, getAuthHeaders(token)),
    demoteAdmin: (url, token, id) => axios.put(`${url}/api/superadmin/admins/${id}/demote`, {}, getAuthHeaders(token)),
    getUsers: (url, token) => axios.get(`${url}/api/superadmin/users`, getAuthHeaders(token)),
    deleteUser: (url, token, id) => axios.delete(`${url}/api/superadmin/users/${id}`, getAuthHeaders(token)),
}
