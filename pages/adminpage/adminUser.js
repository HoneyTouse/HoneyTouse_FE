import { URL } from "../assets/js/constants";

document.addEventListener("DOMContentLoaded", function () {
  // 회원 관리 버튼
  document.getElementById("userBtn").addEventListener("click", function () {
    fetchUsersPage();
  });
});
// 회원 관리 페이지 표시 함수
function fetchUsersPage() {
  const jwt = localStorage.getItem("jwt");

  fetch(`${URL}/admin/userInfo`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + jwt,
    },
  })
    .then((response) => response.text())
    .then((data) => {
      const users = JSON.parse(data).data;
      console.log(users);
      document.getElementById("content").innerHTML = `
      <div id="user-list">
      ${users
        .map(
          (user) =>
            `
            <ul>
            <li><strong>사용자ID:</strong>${user._id}</li>
            <li><strong>이름: </strong>${user.name}</li>
            <li><strong>이메일: </strong>${user.email}</li>
            <li><strong>비밀번호: </strong>${user.password}</li>
            <li><strong>역할:</strong> ${user.role}</li>
            <li><strong>주소: </strong>${user.address}</li>
            <li><strong>상세주소:</strong> ${user.addressDetail}</li>
            </ul>`
        )
        .join("")}
      </div>
      `;
    })
    .catch((error) => {
      console.error("회원 관리 페이지를 가져오는 중 오류 발생:", error);
    });
}
