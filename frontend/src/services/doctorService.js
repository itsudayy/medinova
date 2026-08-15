import api from './api';

export const fetchDoctors = (params) => api.get('/doctors', { params }).then((r) => r.data);
export const fetchDoctorById = (id) => api.get(`/doctors/${id}`).then((r) => r.data);
export const fetchMyDoctorProfile = () => api.get('/doctors/me/profile').then((r) => r.data);
export const saveMyDoctorProfile = (payload) => api.put('/doctors/me/profile', payload).then((r) => r.data);
export const fetchDoctorReviews = (id) => api.get(`/doctors/${id}/reviews`).then((r) => r.data);
