import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const register = (name: string, email: string, password: string) =>
  api.post('/auth/register', { name, email, password });

export const getForms = () =>
  api.get('/forms');

export const createForm = (formData: any) =>
  api.post('/forms', formData);

export const updateForm = (id: string, formData: any) =>
  api.put(`/forms/${id}`, formData);

export const deleteForm = (id: string) =>
  api.delete(`/forms/${id}`);

export const submitForm = (id: string, answers: any) =>
  api.post(`/forms/${id}/submit`, { answers });

export const getResponses = (id: string) =>
  api.get(`/forms/${id}/responses`);

export default api;