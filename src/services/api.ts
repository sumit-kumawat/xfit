/**
 * SQLite API Client Service for XFIT Platform
 * Manages database persistence via Express + SQLite endpoints
 */

const API_BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.hostname}:3001`
  : 'http://localhost:3001';

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (res.ok) {
      const data = await res.json();
      return data.status === 'online';
    }
  } catch (err) {
    console.warn('[SQLite API] Server offline, using memory persistence');
  }
  return false;
}

export async function saveToSQLite<T>(key: string, data: T): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/store/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
