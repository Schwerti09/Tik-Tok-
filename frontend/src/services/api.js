import axios from 'axios';

const api = axios.create({
  baseURL: '/.netlify/functions',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.warn('API Fehler:', err.message);
    return Promise.reject(err);
  }
);

export default api;
