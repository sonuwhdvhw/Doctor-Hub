import axios from 'axios'

const getAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        token,
    },
})

export const assistantApi = {
    getDashboard: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/assistant/dashboard`, getAuthHeaders(token)),

    getPendingPayments: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/assistant/pending-payments`, getAuthHeaders(token)),

    verifyPayment: (backendUrl, token, id) =>
        axios.put(`${backendUrl}/api/assistant/payments/${id}/verify`, {}, getAuthHeaders(token)),

    rejectPayment: (backendUrl, token, id, reason) =>
        axios.put(`${backendUrl}/api/assistant/payments/${id}/reject`, { reason }, getAuthHeaders(token)),

    getAppointments: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/assistant/appointments`, getAuthHeaders(token)),

    getBookings: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/assistant/bookings`, getAuthHeaders(token)),
}
