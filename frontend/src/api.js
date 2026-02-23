export const baseUrl = import.meta.env.VITE_API_URL || '';

export async function apiFetch(path, options = {}, token = null) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(baseUrl + path, { ...options, headers });
  return res;
}
