import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Builds a clean query string, skipping "all"/empty values
const toQuery = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v && v !== 'all')
  );
  return new URLSearchParams(clean).toString();
};

export const taskAPI = {
  getAll: (params) => api.get(`/tasks?${toQuery(params)}`).then((res) => res.data),
  getOne: (id) => api.get(`/tasks/${id}`).then((res) => res.data),
  create: (task) => api.post('/tasks', task).then((res) => res.data),
  update: (id, task) => api.put(`/tasks/${id}`, task).then((res) => res.data),
  remove: (id) => api.delete(`/tasks/${id}`).then((res) => res.data),
};

export default api;
