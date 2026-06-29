import { apiClient } from './apiClient';

export const sessionApi = {
  getAll: () => apiClient('/admin/sessions', { auth: true }),

  getById: (id) => apiClient(`/admin/sessions/${id}`, { auth: true }),

  create: (data) =>
    apiClient('/admin/session', {
      method: 'POST',
      body: data,
      auth: true,
    }),

  update: (id, data) =>
    apiClient(`/admin/session/${id}`, {
      method: 'PUT',
      body: data,
      auth: true,
    }),

  delete: (id) =>
    apiClient(`/admin/session/${id}`, {
      method: 'DELETE',
      auth: true,
    }),
};