import { apiClient } from "./apiClient";

export const eventApi = {
  getAll: () => apiClient("/events"),
};