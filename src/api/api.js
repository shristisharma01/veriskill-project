import axios from 'axios';

const BASE_URL = 'http://localhost:9090/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

export const analyzeResume = (content) =>
  api.post('/resume/analyze', { content, type: 'RESUME' });
export const getResumeHistory = () => api.get('/resume/history');

export const analyzeEmail = (content) =>
  api.post('/email/analyze', { content, type: 'EMAIL' });