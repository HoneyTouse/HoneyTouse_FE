import Swal from 'sweetalert2'
import {URL} from '../assets/js/constants'

async function fetchCategoryId(categoryName) {
  const res = await fetch(`${URL}/categories`)
  const resData = await res.json()
  if (!resData || !Array.isArray(resData.data)) {
    console.error('카테고리 데이터가 유효하지 않습니다.')
    return null
  }
  const category = resData.data.find(cat => cat.name === categoryName)
  return category ? category._id : null
}

// 제품 API에서 해당 카테고리의 제품을 조회
async function productsByCategory(categoryName) {
  const categoryId = await fetchCategoryId(categoryName)
  if (!categoryId) {
    console.error('카테고리를 찾을 수 없습니다.')
    return
  }
  try {
    const res = await fetch(`${URL}/products?categoryId=${categoryId}`)
    const resData = await res.json()
    if (!resData || !Array.isArray(resData.data)) {
      console.error('제품 데이터가 유효하지 않습니다.')
      return
    }
    updateCategoryName(categoryName)
    checkProducts(resData.data)
    // console.log(resData.data)
  } catch (error) {
    console.error('제품을 조회하는 중 에러가 발생했습니다:', error)
  }
}

// 카테고리 이름 업데이트
function updateCategoryName(categoryName) {
  document.getElementById('categoryName').innerText = categoryName;
}

// 제품 목록 체크하여 화면에 표시
function checkProducts(products) {
  const productList = document.getElementById('pdtList')
  const productHTML = products.map(product => `
    <li id="${product._id}" class="pdt-list-item">
      <div class="pdt-box">
        <div class="pdt-content-image">
          <i class="fa-solid fa-bag-shopping pl_basketBtn" onclick="goToBasketBtn(this)"></i>
          <a href="/pdt-info/index.html?id=${product._id}">
            <img src="${product.image}" alt="${product.name}">
          </a>
        </div>
        <div class="pdt-content-image-info">
          <p class="pdt-name">
            <a href="/pdt-info/index.html?id=${product._id}">${product.name}</a>
          </p>
          <p class="pdt-price">
            <span>${product.price.toLocaleString('ko-KR')}원</span>
          </p>
        </div>
      </div>
    </li>
  `).join('')
  productList.innerHTML = productHTML
}

function goToBasketBtn(e) {
  let basketItemList = JSON.parse(localStorage.getItem('basketItemList')) ?? [];
  const productId = e.closest('li').id;
  fetch(`${URL}/products/${productId}`, {
      method: 'GET',
  }).then(response => response.json())
      .then(data => {
          let isDone = false;
          for (let obj of basketItemList) {
              if (obj.id === data.data._id) {
                  obj.count++;
                  isDone = true;
                  break;
              }
          }
          if (!isDone) {
              basketItemList.push({
                  ...data.data,
                  id: data.data._id,
                  count: 1,
                  isChecked: false,
                  allOption: {
                      [data.data.options?.name]: data.data.options?.value,
                  },
                  choiceOption: {
                      [data.data.options?.name]: data.data.options?.value[0],
                  },
              })
          }
          // console.log(basketItemList);
          localStorage.setItem('basketItemList', JSON.stringify(basketItemList));
          Swal.fire({
              title: "장바구니에 담겼습니다.",
              text: `${data.data.name}`,
              icon: "success",
              customClass: {
                  container: 'custom-popup'
              }
          });
      })
      .catch((error) => {
          console.error('Error:', error);
      });
}
window.goToBasketBtn = goToBasketBtn;


// 페이지 로드 시 카테고리 이름 파라미터를 가져와 해당 카테고리의 제품 조회
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search)
  const categoryName = urlParams.get('category')
  if (categoryName) {
    productsByCategory(categoryName)
  }
})