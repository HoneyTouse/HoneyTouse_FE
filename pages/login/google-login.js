import { URL } from "/assets/js/constants";

// Google 로그인 버튼 처리
export async function handleGoogleLoginRedirect() {
  window.location.href = `${URL}/auth/google`; // 서버로 로그인 요청 보내기
  sessionStorage.setItem("isSocialLogIn", true); // 세션스토리지에 소셜로그인 여부 체크
}
