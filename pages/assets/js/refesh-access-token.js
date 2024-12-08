import { URL } from './constants';

export async function refreshAccessToken() {
  try {
    const response = await fetch(`${URL}/auth/refresh-access-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Failed to refresh access token', error);
    return null;
  }
}
