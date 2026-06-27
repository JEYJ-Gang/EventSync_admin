import { apiClient } from "./apiClient";

export const speakerApi = {
  getAll: () => apiClient("/speakers"),
};