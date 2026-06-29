import { apiClient } from './apiClient';
import { eventApi } from './event.api'; // on importe eventApi

export const sessionApi = {
  // Récupère toutes les sessions depuis les événements (fallback)
  getAll: async () => {
    try {
      // Essayer d'abord la route admin si elle existe
      const response = await apiClient('/admin/sessions', { auth: true });
      // Si c'est un tableau, on le retourne
      if (Array.isArray(response)) return response;
      if (response?.data && Array.isArray(response.data)) return response.data;
      if (response?.sessions && Array.isArray(response.sessions)) return response.sessions;
      // Sinon, on tente de récupérer via les événements
      throw new Error('Route admin non disponible, fallback sur événements');
    } catch (err) {
      // Fallback : récupérer les événements et extraire les sessions
      const events = await eventApi.getAll();
      const sessions = [];
      (Array.isArray(events) ? events : events?.data || events?.events || []).forEach(ev => {
        const evSessions = ev.sessions || ev.session_list || [];
        evSessions.forEach(s => {
          sessions.push({
            ...s,
            eventId: ev.id, // ajoute l'eventId pour les références
            eventName: ev.name,
          });
        });
      });
      return sessions;
    }
  },

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