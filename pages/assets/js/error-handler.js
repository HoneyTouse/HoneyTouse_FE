import Swal from 'sweetalert2';

// 401 Unauthorized 오류가 발생하면 로그인 페이지로 리다이렉트
export function handleAuthError(response) {
  if (response.status === 401) {
    Swal.fire({
      title: '세션 만료',
      text: '세션이 만료되었습니다. 다시 로그인해주세요.',
      icon: 'error',
      confirmButtonText: '확인',
      customClass: {
        container: 'custom-popup',
      },
    }).then(() => {
      window.location.href = '/login/index.html';
    });
    return true;
  }
  return false;
}
