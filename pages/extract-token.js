// // 구글로그인 후 서버에서 클라이언트로 리다이렉션 후에 실행됨.
// // 이때 URL로 넘긴 쿼리파라미터의 토큰 값을 지워주고 메인페이지를 새로고침함.

// window.onload = function () {
//   // 쿼리 파라미터 값을 이름으로 가져오는 함수
//   function getQueryParam(param) {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(param);
//   }

//   // 쿼리 파라미터 없이 URL 업데이트하는 함수
//   function updateUrlWithoutParams() {
//     const url = new URL(window.location);
//     url.search = ""; // 모든 쿼리파라미터 제거
//     history.replaceState(null, "", url.toString()); // 페이지 새로고침 없이 URL 업데이트
//     window.location.href = "/"; // 메인 페이지로 리다이렉션
//   }

//   // URL 파라미터에서 토큰 추출
//   const token = getQueryParam("token");

//   // 유효한 토큰일 경우 로컬스토리지에 넣고 URL에서 제거하기
//   if (token !== null && token !== undefined) {
//     localStorage.setItem("jwt", token);

//     updateUrlWithoutParams();
//   }
// };
