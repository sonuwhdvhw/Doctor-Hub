import axios from 'axios'

export const getAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        token,
    },
})

export const patientApi = {
    getDashboard: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/patient/dashboard`, getAuthHeaders(token)),

    listDoctors: (backendUrl, token, params = {}) =>
        axios.get(`${backendUrl}/api/doctors`, { ...getAuthHeaders(token), params }),

    getDoctor: (backendUrl, token, id) =>
        axios.get(`${backendUrl}/api/doctors/${id}`, getAuthHeaders(token)),

    bookAppointment: (backendUrl, token, data) =>
        axios.post(`${backendUrl}/api/appointments`, data, getAuthHeaders(token)),

    uploadPayment: (backendUrl, token, formData) =>
        axios.post(`${backendUrl}/api/payments`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                token,
                'Content-Type': 'multipart/form-data',
            },
        }),

    getAppointments: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/patient/appointments`, getAuthHeaders(token)),

    getHistory: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/patient/history`, getAuthHeaders(token)),

    getPrescriptions: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/patient/prescriptions`, getAuthHeaders(token)),

    downloadPrescriptionPdf: (backendUrl, token, id) =>
        axios.get(`${backendUrl}/api/patient/prescriptions/${id}/pdf`, {
            ...getAuthHeaders(token),
            responseType: 'blob',
        }),

    getReports: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/patient/reports`, getAuthHeaders(token)),

    uploadReport: (backendUrl, token, formData) =>
        axios.post(`${backendUrl}/api/patient/reports`, formData, {
            headers: { Authorization: `Bearer ${token}`, token, 'Content-Type': 'multipart/form-data' },
        }),

    getContacts: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/patient/contacts`, getAuthHeaders(token)),

    getMessages: (backendUrl, token, withUserId) =>
        axios.get(`${backendUrl}/api/patient/messages`, { ...getAuthHeaders(token), params: { withUserId } }),

    sendMessage: (backendUrl, token, data) =>
        axios.post(`${backendUrl}/api/patient/messages`, data, getAuthHeaders(token)),
}
