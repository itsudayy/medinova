import api from './api';

export const bootstrapAdmin = (adminSecret) =>
  api.post('/users/bootstrap-admin', {}, { headers: { 'x-admin-secret': adminSecret } }).then((r) => r.data);
export const fetchDoctorUsers = () => api.get('/users/doctors').then((r) => r.data);
export const setDoctorStatus = (id, status) => api.patch(`/users/${id}/status`, { status }).then((r) => r.data);
