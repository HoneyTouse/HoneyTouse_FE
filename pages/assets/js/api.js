import { handleAuthError } from './error-handler';

export async function makeFetchRequest(url, options) {
  const originalRequest = {
    url,
    options: {
      ...options,
      credentials: 'include',
    },
  };
  try {
    let response = await fetch(url, originalRequest.options);

    // 401 또는 403 에러 처리
    if (await handleAuthError(response, originalRequest)) {
      return await fetch(url, originalRequest.options);
    }

    if (!response.ok) {
      throw new Error(`Status: ${response.status}, Message: Network response was not ok`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch request 에러: ', error);
  }
}
