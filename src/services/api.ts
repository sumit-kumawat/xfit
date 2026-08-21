/**
 * SQLite API & Authentication Service for XFIT Platform
 * Handles session tokens, authentication, RBAC, and database operations.
 */

const API_BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.hostname}:3002`
  : 'http://localhost:3002';

const TOKEN_KEY = 'xfit_auth_token';

export function getStoredToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearStoredToken() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function loginApi(identifier: string, pass: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password: pass }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      setStoredToken(data.token);
      return { success: true, token: data.token, user: data.user };
    }
    return { success: false, error: data.error || 'Authentication failed' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server connection error' };
  }
}

export async function logoutApi(): Promise<boolean> {
  const token = getStoredToken();
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.warn('[Auth API] Logout server call failed', err);
    }
  }
  clearStoredToken();
  return true;
}

export async function getCurrentUserApi(): Promise<{ success: boolean; user?: any }> {
  const token = getStoredToken();
  if (!token) return { success: false };

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, user: data.user };
    }
  } catch (err) {
    console.warn('[Auth API] Session verification failed', err);
  }
  clearStoredToken();
  return { success: false };
}

export async function saveToSQLite<T>(key: string, data: T): Promise<boolean> {
  try {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE_URL}/api/store/${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.warn(`[SQLite API] Failed to save ${key}:`, err);
    return false;
  }
}

export async function loadFromSQLite<T>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/store/${key}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`[SQLite API] Failed to load ${key}:`, err);
  }
  return null;
}
