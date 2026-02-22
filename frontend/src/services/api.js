import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/.netlify/functions';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const trendRadarAPI = {
  getTrends: (platform = 'tiktok', timeframe = '24h') =>
    api.get(`/trendradar?platform=${platform}&timeframe=${timeframe}`),
};

export const ideaGenAPI = {
  generateIdea: (payload) => api.post('/ideagen', payload),
};

export const videoProcessAPI = {
  processVideo: (payload) => api.post('/video-process', payload),
};

export const schedulerAPI = {
  getScheduled: () => api.get('/scheduler'),
  createPost: (payload) => api.post('/scheduler', payload),
};

export const analyticsAPI = {
  getAnalytics: (startDate, endDate) =>
    api.get(`/analytics?startDate=${startDate}&endDate=${endDate}`),
};

export const stripeAPI = {
  webhook: (payload, signature) =>
    api.post('/stripe', payload, { headers: { 'stripe-signature': signature } }),
};

export default api;
