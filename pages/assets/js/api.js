import { handleAuthError } from './error-handler';

export async function makeFetchRequest(url, options) {
  try {
    const response = await fetch(url, options);

    // 401 또는 403 에러 처리
    if (await handleAuthError(response)) {
      return;
    }

    if (!response.ok) {
      throw new Error(`Status: ${response.status}, Message: Network response was not ok`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch request 에러: ', error);
  }
}
