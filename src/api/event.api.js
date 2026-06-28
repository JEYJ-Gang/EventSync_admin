import { apiClient } from "./apiClient";

export const eventApi = {
  getAll: () => apiClient("/events"),

  getById: (eventId) => apiClient(`/events/${eventId}`),

  create: (data) =>
    apiClient("/admin/event", {
      method: "POST",
      body: data,
      auth: true,
    }),

  update: (eventId, data) =>
    apiClient(`/admin/event/${eventId}`, {
      method: "PUT",
      body: data,
      auth: true,
    }),

  delete: (eventId) =>
    apiClient(`/admin/event/${eventId}`, {
      method: "DELETE",
      auth: true,
    }),
};