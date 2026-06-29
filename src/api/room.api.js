import { apiClient } from "./apiClient";

export const roomApi = {
    listByEvent: (eventId) =>
        apiClient(`/events/${eventId}/rooms`),

    getById: (eventId, roomId) =>
        apiClient(`/events/${eventId}/rooms/${roomId}`),

    create: (eventId, data) =>
        apiClient(`/events/${eventId}/rooms`, {
            method: "POST",
            body: data,
            auth: true,
        }),

    update: (eventId, roomId, data) =>
        apiClient(`/events/${eventId}/rooms/${roomId}`, {
            method: "PUT",
            body: data,
            auth: true,
        }),

    delete: (eventId, roomId) =>
        apiClient(`/events/${eventId}/rooms/${roomId}`, {
            method: "DELETE",
            auth: true,
        }),
};