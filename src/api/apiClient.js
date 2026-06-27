const API_URL = import.meta.env.VITE_API_URL;

export async function apiClient(path) {
  const res = await fetch(`${API_URL}${path}`);
  return res.json();
}