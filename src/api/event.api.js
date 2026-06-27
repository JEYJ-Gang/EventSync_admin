const API_URL = import.meta.env.VITE_API_URL;

export const eventApi = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/events`);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/events/${id}`);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};