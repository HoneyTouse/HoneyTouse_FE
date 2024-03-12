import { URL } from "../assets/js/constants";

window.onload = async () => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    // jwt가 없는 경우
    alert("너는 권한이 없단다. 아가야");
    window.location.href = "/";
    return; // 함수 종료
  }

  const user = await fetch(`${URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + jwt,
    },
  });

  if (user.status === 401) {
    // Unauthorized 에러 처리
    alert("너는 권한이 없단다. 아가야");
    window.location.href = "/";
    return; // 함수 종료
  }

  const userData = await user.json();
  const role = userData.data.role;
  console.log(role);

  if (role !== "admin") {
    // 권한이 없는 사용자 처리
    alert("너는 권한이 없단다. 아가야");
    window.location.href = "/";
  } else {
    // 권한이 있는 사용자 처리
    document.querySelector(".admin-info").innerHTML = `
      <ul>
        <li>${userData.data.name}</li>
        <li>${userData.data.email}</li>
      </ul>`;
  }
};
