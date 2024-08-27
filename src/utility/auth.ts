import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { useCookies } from 'react-cookie';

let cachedAuthStatus = null;

export async function getAuthStatus() {
  if (cachedAuthStatus) {
    return cachedAuthStatus;
  }

  try {
    const response = await fetch('/api/auth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    cachedAuthStatus = data.isAuthenticated ? data.user : null;
    return cachedAuthStatus;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return null;
  }
}

export function clearAuthStatusCache() {
  cachedAuthStatus = null;
}