import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { useCookies } from 'react-cookie';

let cachedAuthStatus = null;

export async function getAuthStatus() {
  try {
    const response = await fetch('/api/auth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.isAuthenticated ? data.user : null;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return null;
  }
}

export function clearAuthStatusCache() {
  cachedAuthStatus = null;
}