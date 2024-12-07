import { URL } from '/assets/js/constants';

// Google 로그인 버튼 처리
export async function handleGoogleLoginRedirect() {
  window.location.href = `${URL}/auth/google`;
}
