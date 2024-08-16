import { URL } from "./assets/js/constants.js";

// 로그인 상태 확인 함수
function isLoggedIn() {
  // localStorage에 로그인 토큰이 있는지 확인
  let isLoggedIn = false;

  const token = localStorage.getItem("jwt");

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

      console.log("로그인 확인 요청:", data);

      if (data.loggedIn) {
        // 로그인 상태일 경우, 토큰을 localStorage에 저장하고 메인 페이지로 리다이렉트
        localStorage.setItem("jwt", data.token);
        location.href = "/index.html";
      } else {
        // 로그인 상태가 아닐 경우, 메시지 로그 (필요시 로그인 페이지로 리다이렉트 가능)
        console.log("로그인되지 않음");
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
    console.log("사용자가 이미 로그인되어 있어 서버 요청이 필요하지 않음.");
  }
}

// 메인 페이지 HTML이 로딩될 때 해당 함수가 호출됨
initializeLoginStatus();

/*
import { URL } from "./assets/js/constants.js";

// 로그인 상태 확인 함수
function isLoggedIn() {
  let isLoggedIn = false;

  // 로그인 토큰이 존재하는 경우
  if (localStorage.getItem("jwt")) {
    console.log("로컬스토리지에 이미 토큰이 존재합니다.");
    isLoggedIn = true; // 이미 로그인된 상태
  }

  // 이미 로그인 상태가 확인된 경우
  if (sessionStorage.getItem("loginStatusChecked")) {
    console.log("세션스토리지에 로그인이 확인되었습니다.");
    isLoggedIn = true; // 로그인 상태 확인이 완료된 경우
  }

  return isLoggedIn; // 로그인 상태 확인 필요
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

      console.log("!!!!!!!!!!1로그인 확인 요청", data);

      if (data.loggedIn) {
        // 로그인 상태일 경우
        localStorage.setItem("jwt", JSON.stringify(data.token));
        location.href = "/index.html";
      } else {
        // 로그인 상태가 아닐 경우
        console.log("Not logged in");
      }
    } else {
      console.error("Error checking login status");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  // 로그인 상태 확인 완료 플래그 설정
  sessionStorage.setItem("loginStatusChecked", "true");
}

// 로그인 상태를 확인하고 요청을 보내지 않도록 설정
async function initializeLoginStatus() {
  if (!isLoggedIn()) {
    await checkLoginStatusFromServer();
    return;
  }
}

// 메인 페이지 HTML이 로딩될 때 해당 함수가 호출됨.
initializeLoginStatus();
*/

/*
// 로그인 상태를 확인하고 요청을 보내지 않도록 설정
async function checkCookieLoginStatus() {
  // 이미 로그인 상태가 확인된 경우
  const isChecked = sessionStorage.getItem("loginStatusChecked");
  if (isChecked) {
    console.log("Login status already checked");
    return;
  }

  // 로그인 상태 확인
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    // 이미 로그인된 상태
    console.log("Already logged in");
    location.href = "/index.html"; // 로그인 페이지로 리다이렉트
    return;
  }

  // 로그인 상태를 확인하기 위해 서버로 요청
  try {
    const response = await fetch(`${URL}/auth/status`, {
      method: "GET",
      credentials: "include", // 쿠키 전달
    });

    if (response.ok) {
      const data = await response.json();

      if (data.loggedIn) {
        // 로그인 상태일 경우
        localStorage.setItem("jwt", JSON.stringify(data.token));
        location.href = "/index.html";
      } else {
        // 로그인 상태가 아닐 경우
        console.log("Not logged in");
      }
    } else {
      console.error("Error checking login status");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  // 로그인 상태 확인 완료 플래그 설정
  sessionStorage.setItem("loginStatusChecked", "true");
}
if (
  !sessionStorage.getItem("loginStatusChecked") &&
  localStorage.getItem("jwt") !== null &&
  localStorage.getItem("jwt") !== undefined
) {
  checkCookieLoginStatus();
}
  */
