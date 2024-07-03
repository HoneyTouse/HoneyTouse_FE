import { URL, hostUrl } from "../assets/js/constants.js";

// 모달팝업 선택자 모음
const modal = document.querySelector(".modal");
const btnOpenModal = document.querySelector(".profile_btn");
const btnOpenModalText = document.querySelector(".profile_click");
const btnCloseModal = document.querySelector(".user_cancle");
const btnCloseModal2 = document.querySelector(".user_agree");
const jwt = localStorage.getItem("jwt");
const $userPassInput = document.querySelector(".user_pass_input");
const $userPassInput02 = document.querySelector(".user_pass_input-02");
const fileInput = document.querySelector(".myimg");
const userThumbImg = document.querySelector(".user_thumb_img");
const outerThumbImg = document.querySelector("#outerThumbImg");

btnOpenModal.addEventListener("click", () => {
  modal.style.display = "flex";
});
btnOpenModalText.addEventListener("click", () => {
  modal.style.display = "flex";
});
btnCloseModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// 유저 정보 불러오기 (마이페이지 메인)
fetch(`${URL}/auth/me`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("jwt"),
  },
})
  .then((response) => response.json())
  .then((data) => {
    const email = data.data.email;
    const name = data.data.name;
    const profileImage = data.data.profileImage;
    let profileImageUrl;

    if (profileImage && profileImage !== "") {
      profileImageUrl = `${hostUrl}/${profileImage}`;
    } else {
      profileImageUrl = "../assets/img/admin_profile.jpg";
    }

    outerThumbImg.src = profileImageUrl;

    if (email) {
      document.querySelector("#userEmail").innerHTML = email;
      document.querySelector("#userName").innerHTML = `${name} 님`;
    }
  })
  .catch((error) => {
    console.error("Error", error);
  });

// 유저 정보 불러오기(팝업)
fetch(`${URL}/auth/me`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("jwt"),
  },
})
  .then((response) => response.json())
  .then((data) => {
    const email = data.data.email;
    const name = data.data.name;
    const profileImage = data.data.profileImage;
    const profileImageUrl = `${hostUrl}/${profileImage}`;

    if (email) {
      document.querySelector("#userEmailPop").innerHTML = email;
      document.querySelector("#userNamePop").innerHTML = `${name} 님`;
    }
    if (profileImage) {
      userThumbImg.src = profileImageUrl;
    }
  })
  .catch((error) => {
    console.error("Error", error);
  });

// 배송내역
fetch(`${URL}/orders`, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + jwt,
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    const orders = data.data;

    //입금대기, 결제완료, 배송준비, 배송중, 배송완료, 구매확정
    let PaymentPendingArr = [];
    let PaymentCompletedArr = [];
    let DeliveryPendingArr = [];
    let DeliveryOngoingArr = [];
    let DeliveryCompletedArr = [];
    let PurchaseCompletedArr = [];

    data.data.forEach((el) => {
      if (el.status == "결제 완료") {
        PaymentCompletedArr.push(el);
      }
      if (el.status == "배송 준비") {
        DeliveryPendingArr.push(el);
      }
      if (el.status == "배송 중") {
        DeliveryOngoingArr.push(el);
      }
      if (el.status == "배송 완료") {
        DeliveryCompletedArr.push(el);
      }
      if (el.status == "구매 확정") {
        PurchaseCompletedArr.push(el);
      }
    });

    document.querySelector(".payment-completed-length").innerHTML =
      `${PaymentCompletedArr.length}`;
    document.querySelector(".delivery-pending-length").innerHTML =
      `${DeliveryPendingArr.length}`;
    document.querySelector(".delivery-ongoing-length").innerHTML =
      `${DeliveryOngoingArr.length}`;
    document.querySelector(".delivery-completed-length").innerHTML =
      `${DeliveryCompletedArr.length}`;
    document.querySelector(".purchase-completed-length").innerHTML =
      `${PurchaseCompletedArr.length}`;
  });

// 주문 목록 가져오기
fetch(`${URL}/orders`, {
  method: "GET",
  headers: {
    Authorization: "Bearer " + jwt,
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    const order = data.data[data.data.length - 1];
    const orderContainer = document.getElementById("orders"); // 주문 목록을 표시할 요소 선택

    const li = document.createElement("li");
    li.classList.add("info-product", "info-order");

    let productId = order.product[0].id;
    fetch(`${URL}/products/` + productId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
    })
      .then((response) => response.json())
      .then((pdtObject) => {
        const product = pdtObject.data;

        // 주문 정보를 li 요소에 추가
        li.innerHTML = `
                    <div class="section_title">
                        <h2 style="padding: 0">${formatDate(order.createdAt)}</h2>
                    </div>
                    <article class="section_content order-in-progress wrap">
                        <p class="order-status">

                            ${order.status}<span class="_date sub-text">${order.updatedAt.slice(0, 10)}</span>

                            <a href="/order-list/"><span>상세보기>></span></a>
                        </p>
                        <div class="order_content">
                            <ul class="ordered-products">
                                <li class="info_line">
                                    <div class="product_img">
                                        <a href="/pdt-info/?id=${product._id}">
                                            <img src="${product.image}" alt="Product Image" />
                                        </a>
                                    </div>
                                    <div class="product_detail">
                                        <p style="margin-bottom: 10px">${product.name} 외 ${order.product.length}건</p>
                                        <p class="option sub-text">color: black</p>
                                        <p class="price">
                                            ${product.price.toLocaleString()}원
                                            <span class="qty sub-text">${order.product[0].count}개</span>
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </article>
                    `;
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });

    orderContainer.appendChild(li); // 새로운 주문 요소를 주문 목록에 추가
  });

// 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
function formatDate(dateString) {
  const createdAt = new Date(dateString);
  const year = createdAt.getFullYear();
  const month = String(createdAt.getMonth() + 1).padStart(2, "0");
  const day = String(createdAt.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 비밀번호 변경
btnCloseModal2.addEventListener("click", () => {
  if ($userPassInput.value == $userPassInput02.value) {
    fetch(`${URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwt,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let email = data.data.email;
        let address = data.data.address;
        let addressDetail = data.data.addressDetail;

        let userData = {
          email,
          password: $userPassInput.value,
          address,
          addressDetail,
        };

        fetch(`${URL}/auth/me`, {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + jwt,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
          .then((response) => response.json())
          .then((data) => {
            alert("회원 정보가 수정되었습니다.");
          });
      });
  }
});

// 프로필 이미지 업로드
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("profileImage", file);

    fetch(`${URL}/auth/upload-profile-image`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + jwt,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          userThumbImg.src = `${hostUrl}/${data.imageUrl}`;
          alert("프로필 이미지가 업로드되었습니다.");
        } else {
          alert("프로필 이미지 업로드에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("프로필 이미지 업로드 중 오류가 발생했습니다.");
      });
  } else {
    alert("업로드할 이미지를 선택해주세요.");
  }
});

// 프로필관리 모달창 닫을 때 이미지 동기화
btnCloseModal2.addEventListener("click", () => {
  modal.style.display = "none";
  outerThumbImg.src = userThumbImg.src;
});
