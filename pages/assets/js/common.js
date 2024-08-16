import { headerHTML } from "./header";
import { footerHTML } from "./footer";
import { URL } from "./constants.js";

// HTML 로딩이 완료된 후 실행할 코드
window.addEventListener("load", () => {
  // 헤더푸터 로딩
  document.querySelector(".header").innerHTML = headerHTML;
  document.querySelector(".footer").innerHTML = footerHTML;

  // 최신검색어
  let searchArr = JSON.parse(localStorage.getItem("searchArr")) ?? [];
  // 검색버튼 클릭이벤트
  const $headerSearchBtn = document.querySelector(".h_search");
  const $search = document.querySelector(".search");
  const $searchCloseBtn = document.querySelector(".search_close");
  const $searchRecentUl = document.querySelector(".search_recent>ul");
  const $searchForm = document.querySelector(".search_form");
  const $searchText = document.querySelector(".search_text");
  const $searchRecentResetBtn = document.querySelector(".search_recent_reset");
  //검색팝업 끄기/켜기
  $headerSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    $search.classList.add("on");
  });
  $searchCloseBtn.addEventListener("click", () => {
    $search.classList.remove("on");
  });

  //최근검색어 생성
  searchArr.forEach((el) => {
    $searchRecentUl.innerHTML += createsearchRecent(el);
  });

  //최근검색어 삭제
  $searchRecentResetBtn.addEventListener("click", () => {
    $searchRecentUl.innerHTML = "";
    searchArr = [];
    localStorage.setItem("searchArr", JSON.stringify(searchArr));
  });

  //폼이벤트
  $searchForm.addEventListener("submit", (e) => {
    searchArr.push($searchText.value);
    localStorage.setItem("searchArr", JSON.stringify(searchArr));
  });

  // 카테고리 호버시 메뉴 펼침
  const $hmCategory = document.querySelector(".hm_category");
  $hmCategory.addEventListener("mouseover", function () {
    $hmCategory.classList.add("on");
  });
  $hmCategory.addEventListener("mouseout", function () {
    $hmCategory.classList.remove("on");
  });

  //jwt토큰 있을시 마이페이지 클릭시 로그인페이지가 아닌 마이페이지로 넘김
  const jwt = localStorage.getItem("jwt");
  const $hMypageBtn = document.querySelector(".h_mypage-btn");
  const $hMypageText = document.querySelector(".h_mypage_text");
  const $hLogin = document.querySelector(".h_login");
  const $hLoginOut = document.querySelector(".h_login-out");
  if (jwt) {
    $hMypageBtn.href = "/mypage/";
    $hMypageText.href = "/mypage/";
    $hLoginOut.classList.remove("on");
    $hLogin.classList.add("on");
  }

  // 로그아웃 버튼 클릭 이벤트
  $hLoginOut.addEventListener("click", (e) => {
    e.preventDefault();

    let isSocialLogIn = sessionStorage.getItem("isSocialLogIn");
    console.log("isSocialLogIn", isSocialLogIn);
    if (isSocialLogIn) {
      logout();
    }
    localStorage.removeItem("jwt"); // 로컬스토리지의 토큰 삭제
    location.href = "/"; // 새로고침
  });
});

// 로그아웃
async function logout() {
  try {
    const response = await fetch(`${URL}/auth/sign-out`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      localStorage.removeItem("jwt"); // 로컬스토리지의 토큰 삭제
      sessionStorage.removeItem("isSocialLogIn");
      location.href = "/"; // 새로고침
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function createsearchRecent(text) {
  return (
    /*html*/
    `
        <li>
            <a href="">${text}</a>
        </li>
        `
  );
}
