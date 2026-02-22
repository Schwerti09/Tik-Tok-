import { useState, useCallback } from 'react';

const MOCK_USER = {
  id: 'mock-user-001',
  email: 'creator@tikflow.de',
  name: 'Creator',
  plan: 'pro',
  avatar: null,
};

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('tikflow_user');
      return stored ? JSON.parse(stored) : MOCK_USER;
    } catch {
      return MOCK_USER;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const loggedIn = { ...MOCK_USER, email };
    localStorage.setItem('tikflow_user', JSON.stringify(loggedIn));
    setUser(loggedIn);
    setLoading(false);
    return loggedIn;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tikflow_user');
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}
