import { URL } from "/assets/js/constants";

// 쿼리 파라미터 값 가져오기
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  console.log("getQueryParam 함수");
  return urlParams.get(param);
}

// Google 로그인 버튼 처리
export async function handleGoogleLoginRedirect() {
  window.location.href = `${URL}/auth/google`; // 서버로 로그인 요청 보내기
}

// 토큰 처리
export function handleToken() {
  const token = getQueryParam("token");

  if (token) {
    localStorage.setItem("jwt", token);

    // URL에서 토큰 제거
    window.history.replaceState({}, document.title, "/");

    // 메인 페이지로 리다이렉트
    window.location.href = "/";
  }
}
