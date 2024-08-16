import { URL } from "./assets/js/constants.js";

// 로그인 상태 확인 함수
function isLoggedIn() {
  // localStorage에 로그인 토큰이 있는지 확인
  let isLoggedIn = false;

  const token = localStorage.getItem("jwt");

  // 토큰이 유효할 경우 로그인 여부에 true값을 넣어줌.
  if (token !== null && token !== undefined) {
    isLoggedIn = true;
  }

  return isLoggedIn;
}

// 서버로 로그인 상태를 확인하기 위해 요청을 보내는 함수
async function checkLoginStatusFromServer() {
  try {
    const response = await fetch(`${URL}/auth/status`, {
      method: "GET",
      credentials: "include", // 쿠키 전달
    });

    if (response.ok) {
      const data = await response.json();

      if (data.loggedIn) {
        // 로그인 상태일 경우, 토큰을 localStorage에 저장하고 메인 페이지로 리다이렉트
        localStorage.setItem("jwt", data.token);
        location.href = "/index.html";
      } else {
        // 로그인 상태가 아닐 경우, 메시지 로그
        // console.log("로그인되지 않음");
      }
    } else {
      console.error("로그인 상태 확인 중 오류 발생");
    }
  } catch (error) {
    console.error("에러:", error);
  }
}

// 로그인 상태를 확인하고, 로그인되어 있지 않으면 서버에 요청을 보냄
async function initializeLoginStatus() {
  if (!isLoggedIn()) {
    await checkLoginStatusFromServer();
  } else {
    // console.log("사용자가 이미 로그인되어 있어 서버 요청이 필요하지 않음.");
  }
}

// 메인 페이지 HTML이 로딩될 때 해당 함수가 호출됨
initializeLoginStatus();
