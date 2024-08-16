import { URL } from "/assets/js/constants";

// Google 로그인 버튼 처리
export async function handleGoogleLoginRedirect() {
  window.location.href = `${URL}/auth/google`; // 서버로 로그인 요청 보내기
  sessionStorage.setItem("isSocialLogIn", true);
}
