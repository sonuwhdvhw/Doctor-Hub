import axios from 'axios'

export const getAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        token,
    },
})

export const doctorApi = {
    getDashboard: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/doctor/dashboard`, getAuthHeaders(token)),

    getProfile: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/doctor/profile`, getAuthHeaders(token)),

    createProfile: (backendUrl, token, data) =>
        axios.post(`${backendUrl}/api/doctor/profile`, data, getAuthHeaders(token)),

    updateProfile: (backendUrl, token, data) =>
        axios.put(`${backendUrl}/api/doctor/profile`, data, getAuthHeaders(token)),

    getClinics: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/doctor/clinics`, getAuthHeaders(token)),

    addClinic: (backendUrl, token, data) =>
        axios.post(`${backendUrl}/api/doctor/clinic`, data, getAuthHeaders(token)),

    getSchedule: (backendUrl, token, params = {}) =>
        axios.get(`${backendUrl}/api/doctor/schedule`, { ...getAuthHeaders(token), params }),

    setSchedule: (backendUrl, token, data) =>
        axios.post(`${backendUrl}/api/doctor/schedule`, data, getAuthHeaders(token)),

    getAppointments: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/doctor/appointments`, getAuthHeaders(token)),

    getPatients: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/doctor/patients`, getAuthHeaders(token)),

    addMedicalHistory: (backendUrl, token, data) =>
        axios.post(`${backendUrl}/api/doctor/medical-history`, data, getAuthHeaders(token)),

    getMedicalHistory: (backendUrl, token, patientId) =>
        axios.get(`${backendUrl}/api/doctor/medical-history/${patientId}`, getAuthHeaders(token)),

    addPrescription: (backendUrl, token, data) =>
        axios.post(`${backendUrl}/api/doctor/prescription`, data, getAuthHeaders(token)),

    getPrescriptions: (backendUrl, token, patientId) =>
        axios.get(`${backendUrl}/api/doctor/prescriptions/${patientId}`, getAuthHeaders(token)),

    getPatientTimeline: (backendUrl, token, patientId) =>
        axios.get(`${backendUrl}/api/doctor/patient-timeline/${patientId}`, getAuthHeaders(token)),

    getAssistants: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/doctor/assistants`, getAuthHeaders(token)),

    assignAssistant: (backendUrl, token, email) =>
        axios.post(`${backendUrl}/api/doctor/assistants`, { email }, getAuthHeaders(token)),

    removeAssistant: (backendUrl, token, id) =>
        axios.delete(`${backendUrl}/api/doctor/assistants/${id}`, getAuthHeaders(token)),

    downloadPrescriptionPdf: (backendUrl, token, id) =>
        axios.get(`${backendUrl}/api/doctor/prescriptions/${id}/pdf`, {
            ...getAuthHeaders(token),
            responseType: 'blob',
        }),

    getContacts: (backendUrl, token) =>
        axios.get(`${backendUrl}/api/doctor/contacts`, getAuthHeaders(token)),

    getMessages: (backendUrl, token, withUserId) =>
        axios.get(`${backendUrl}/api/doctor/messages`, { ...getAuthHeaders(token), params: { withUserId } }),

    sendMessage: (backendUrl, token, data) =>
        axios.post(`${backendUrl}/api/doctor/messages`, data, getAuthHeaders(token)),
}
