import Swal from 'sweetalert2';
import { refreshAccessToken } from './refesh-access-token';

export async function handleAuthError(response, originalRequest) {
  if (response.status === 401) {
    const response = await refreshAccessToken();

    if (response.status === 200) {
      const responseData = await response.json();
      const { accessToken } = responseData.data;
      localStorage.setItem('jwt', accessToken);

      if (!originalRequest.headers) {
        originalRequest.headers = {};
      }

      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
      const newResponse = await fetch(originalRequest.url, originalRequest.options);
      return newResponse;
    } else {
      await Swal.fire({
        title: '세션 만료',
        text: '세션이 만료되었습니다. 다시 로그인해주세요.',
        icon: 'error',
        confirmButtonText: '확인',
        customClass: {
          container: 'custom-popup',
        },
      });
      localStorage.removeItem('jwt');
      window.location.href = '/login/index.html';
    }
    return true;
  }

  if (response.status === 403) {
    await Swal.fire({
      title: '권한 없음',
      text: '관리자 권한이 없습니다.',
      icon: 'error',
      confirmButtonText: '확인',
      customClass: {
        container: 'custom-popup',
      },
    });
    localStorage.removeItem('jwt');
    window.location.href = '/index.html';
    return true;
  }

  return false;
}
