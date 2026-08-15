import api from './api';

export const createPremiumCheckout = () => api.post('/premium/checkout').then((r) => r.data);
export const confirmPremium = (sessionId) => api.post('/premium/confirm', { sessionId }).then((r) => r.data);
