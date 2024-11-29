import { handleAuthError } from './error-handler';

export async function makeFetchRequest(url, options) {
  return fetch(url, options)
    .then((response) => {
      if (handleAuthError(response)) {
        throw new Error('접근 권한이 없습니다. 로그인 페이지로 리다이렉트합니다.');
      }
      if (!response.ok) {
        throw new Error(`Status: ${response.status}, Message: Network response was not ok`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('401 Authorization 에러: ', error);
    });
}
