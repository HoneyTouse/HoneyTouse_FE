import { URL } from "../assets/js/constants";

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("productBtn").addEventListener("click", function () {
    fetchProductsPage();
  });
});

// 상품 관리 페이지 표시 함수
function fetchProductsPage() {
  fetch(`${URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("access_token"),
    },
  })
    .then((response) => response.json()) // response를 JSON 형식으로 파싱
    .then((data) => {
      const products = data.data;
      console.log(products); // 확인을 위한 로그
      document.getElementById("content").innerHTML = `
          <div id="product-list">
          ${products
            .map(
              (product) =>
                `
                <ul>
                <li><strong>상품 ID:</strong> ${product._id}</li>
                <li><strong>상품명: </strong>${product.name}</li>
                <li><strong>가격: </strong>${product.price}</li>
                <li><strong>브랜드: </strong>${product.brand}</li>
                <li><strong>옵션명: </strong>${product.options ? product.options.name : "없음"}</li>
                <li><strong>옵션값: </strong>${product.options ? product.options.value : "없음"}</li>
                </ul>
                <button onclick="editProduct('${product._id}', '${product.name}', ${product.price}, '${product.brand}', '${product.options ? product.options.name : ""}', '${product.options ? product.options.value : ""}')"><strong>수정</strong></button>
                <button onclick="deleteProduct('${product._id}')"><strong>삭제</strong></button>
`
            )
            .join("")}
          </div>
          `;
    })
    .catch((error) => {
      console.error("상품 관리 페이지를 가져오는 중 오류 발생:", error);
    });
}

// 상품 수정 함수
window.editProduct = function editProduct(
  id,
  name,
  price,
  brand,
  optionName,
  optionValue
) {
  const newName = prompt("새로운 상품명을 입력하세요:", name);
  const newPrice = prompt("새로운 가격을 입력하세요:", price);
  const newBrand = prompt("새로운 브랜드를 입력하세요:", brand);
  const newOptionName = prompt("새로운 옵션명을 입력하세요:", optionName);
  const newOptionValue = prompt("새로운 옵션값을 입력하세요:", optionValue);

  if (
    newName === null ||
    newName.trim() === "" ||
    newPrice === null ||
    newPrice.trim() === "" ||
    newBrand === null ||
    newBrand.trim() === ""
  ) {
    return;
  }

  const updatedData = {
    name: newName,
    price: newPrice,
    brand: newBrand,
    options: {
      name: newOptionName,
      value: newOptionValue,
    },
  };
  const jwt = localStorage.getItem("jwt");

  fetch(`${URL}/admin/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("상품 수정 성공");
      fetchProductsPage(); // 수정 후 페이지 다시 로드
    })
    .catch((error) => {
      console.error("상품 수정 중 오류 발생:", error);
    });
};

// 상품 삭제 함수
window.deleteProduct = function deleteProduct(id) {
  if (!confirm("정말로 삭제하시겠습니까?")) {
    return;
  }
  const jwt = localStorage.getItem("jwt");

  fetch(`${URL}/admin/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("상품 삭제 성공");
      fetchProductsPage(); // 삭제 후 페이지 다시 로드
    })
    .catch((error) => {
      console.error("상품 삭제 중 오류 발생:", error);
    });
};
