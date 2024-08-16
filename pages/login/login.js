import Swal from "sweetalert2";
import { URL } from "/assets/js/constants";
import { handleGoogleLoginRedirect } from "./google-login.js";

//유호성체크
const $loginEmail = document.querySelector(".login_email");
$loginEmail.addEventListener("input", function () {
  if (validateEmail(this.value)) {
    $loginEmail.closest(".login-email-wrap").classList.remove("invalid");
  } else {
    $loginEmail.closest(".login-email-wrap").classList.add("invalid");
  }
});

const $loginPassword = document.querySelector(".login_password");
$loginPassword.addEventListener("input", function () {
  if (isValidPassword(this.value)) {
    $loginPassword.closest(".login-password-wrap").classList.remove("invalid");
  } else {
    $loginPassword.closest(".login-password-wrap").classList.add("invalid");
  }
});

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isValidPassword(password) {
  // 정규식: 8~16자의 영문 대소문자, 숫자, 특수문자가 1개 이상 조합
  const regex =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,16}$/;
  return regex.test(password);
}

//서밋이벤트
function registerLogin(evt) {
  evt.preventDefault(); /* POST 이벤트 중지 */
  const email = evt.target.email.value;
  const password = evt.target.password.value;

  if (!email || !password) {
    Swal.fire({
      title: "아이디, 비밀번호 모두 입력하세요",
      icon: "warning",
      customClass: {
        container: "custom-popup",
      },
    });
    return;
  }

  const data = { email, password };
  fetch(`${URL}/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const jwt = data.data.token;
      // JWT를 로컬 스토리지에 저장합니다.
      localStorage.setItem("jwt", jwt);
      Swal.fire({
        title: "로그인 성공",
        text: `환영합니다`,
        icon: "success",
        customClass: {
          container: "custom-popup",
        },
      }).then((result) => {
        window.location.href = "/";
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        title: "로그인 실패",
        text: `아이디와 비밀번호를 확인하세요.`,
        icon: "error",
        customClass: {
          container: "custom-popup",
        },
      });
    });
}

document.querySelector("form").addEventListener("submit", registerLogin);

//리다이렉트
// 로그인 페이지에 접근할 때마다 실행되는 함수
function checkLoginStatus() {
  // 로컬 스토리지에서 JWT를 가져옵니다.
  const jwt = localStorage.getItem("jwt");

  // JWT가 있으면 사용자가 로그인 상태라는 뜻이므로, 마이페이지로 리다이렉트합니다.
  if (jwt !== null && jwt !== undefined) {
    location.href = "/mypage/index.html";
  }
}

// Google 로그인 버튼 클릭 처리
const googleLoginButton = document.querySelector(".login_sns a");

if (googleLoginButton) {
  googleLoginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    await handleGoogleLoginRedirect(); // Google 로그인 페이지로 리디렉션
  });
}

// 로그인 페이지 로드될 때마다 로그인 여부 확인
checkLoginStatus();
