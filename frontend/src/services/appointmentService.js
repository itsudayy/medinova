import api from './api';

export const createAppointment = (payload) => api.post('/appointments', payload).then((r) => r.data);
export const confirmBooking = (sessionId) => api.post('/appointments/confirm', { sessionId }).then((r) => r.data);
export const fetchMyAppointments = () => api.get('/appointments/mine').then((r) => r.data);
export const fetchMyDoctorAppointments = () => api.get('/appointments/doctor/mine').then((r) => r.data);
export const checkCoupon = (code) => api.get(`/coupons/${encodeURIComponent(code)}`).then((r) => r.data);
export const submitReview = (appointmentId, payload) =>
  api.post(`/appointments/${appointmentId}/review`, payload).then((r) => r.data);
export const fetchPatientStats = () => api.get('/appointments/stats/patient').then((r) => r.data);
export const fetchDoctorStats = () => api.get('/appointments/stats/doctor').then((r) => r.data);
export const setPrescription = (appointmentId, prescription) =>
  api.put(`/appointments/${appointmentId}/prescription`, { prescription }).then((r) => r.data);
