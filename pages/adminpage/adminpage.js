import { URL } from '../assets/js/constants';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', async () => {
  const adminPage = document.querySelector('.inner');
  const jwt = localStorage.getItem('jwt');

  if (!jwt) {
    await Swal.fire({
      title: '권한 없음',
      text: '너는 권한이 없단다. 아가야...',
      icon: 'error',
      confirmButtonText: '확인',
      customClass: {
        container: 'custom-popup',
      },
    });
    window.location.href = '/';
    return;
  }

  try {
    const userInfo = await fetch(`${URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + jwt,
      },
    });

    const { role } = userInfo.data;

    if (role !== 'admin') {
      // 권한이 없는 사용자 처리
      adminPage.style.visibiliy = 'hidden';
      await Swal.fire({
        title: '권한 없음',
        text: '너는 권한이 없단다. 아가야...',
        icon: 'error',
        confirmButtonText: '확인',
        customClass: {
          container: 'custom-popup',
        },
      });
      window.location.href = '/';
      return;
    } else {
      // 권한이 있는 사용자 처리
      adminPage.style.visibility = 'visible';
      document.querySelector('.admin-info').innerHTML = `
      <ul>
        <li>${userInfo.data.name}</li>
        <li>${userInfo.data.email}</li>
      </ul>`;
    }
  } catch (error) {
    await Swal.fire({
      title: '오류',
      text: '인증 중 오류가 발생했습니다.',
      icon: 'error',
      confirmButtonText: '확인',
    });
    window.location.href = '/';
  }
});
