//장바구니 상품 리스트
//임의로 만든 샘플데이터
let basketItemList = JSON.parse(localStorage.getItem('basketItemList')) ?? [];
//옵션 모달창 오픈, 닫기관련
const $optionModal = document.querySelector('.option_modal');

//장바구니에 넣은 제품 뿌려주는 ul태그
const $basketListWrap = document.querySelector('.basket-list-wrap');

//모두선택버튼
const $allCheckBtn = document.querySelector('.all-check-btn'); //모두선택label
const $allCheck = document.querySelector('#all-check'); //모두선택input

basketItemList.forEach((item) => {
  //item정보 넣어서 li 만들고 ul안에다가 넣어줌
  $basketListWrap.innerHTML += createBasketLi(item);
});

// 처음렌더시 상품모두선택되어있을경우 모두선택 check
checkAllSelect();

//결제금액렌더
const $allChoiceProductPrice = document.querySelector('.all-choice-product-price');
renderPaymentAmount();

//모두선택이벤트
$allCheckBtn.addEventListener('click', () => {
  const li = $basketListWrap.querySelectorAll('li');
  if ($allCheck.checked) {
    li.forEach((el) => {
      const productCheckBox = el.querySelector('.basket_select>input');
      productCheckBox.checked = false;
      basketItemList.find((obj) => obj.id == el.id).isChecked = false;
    });
  } else {
    li.forEach((el) => {
      const productCheckBox = el.querySelector('.basket_select>input');
      productCheckBox.checked = true;
      basketItemList.find((obj) => obj.id == el.id).isChecked = true;
    });
  }
  renderPaymentAmount();
  localStorage.setItem('basketItemList', JSON.stringify(basketItemList));
});

//받아온 상품에 대한 정보를 li안에 맞게 넣어줌
function createBasketLi(item) {
  const { id, name, category, price, image, allOption, choiceOption, count, isChecked } = item;
  //선택한 옵션 다 합쳐서 프린트해줄 글자 만들기
  let allchoiceOption = '';
  for (let key in choiceOption) {
    allchoiceOption += `${key} : ${choiceOption[key]} / `;
  }
  allchoiceOption = allchoiceOption.slice(0, -2);

  //체크박스 체크확인
  let checkBox = '';
  if (isChecked) {
    checkBox += `<input type="checkbox" name="" id="bs_check-${id}" style="display: none;" checked onchange="changeProduct()">`;
  } else {
    checkBox += `<input type="checkbox" name="" id="bs_check-${id}" style="display: none;" onchange="changeProduct()">`;
  }

  return (
    /*html*/
    `<li id="${id}" class="basket-list">
            <div class="basket_select">
                ${checkBox}
                <label for="bs_check-${id}" class="bs_check-btn"></label>
                <button onclick="deleteBasketLi(this)">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="basket_product">
                <div class="basket_img">
                    <img src="${image}" alt="">
                </div>
                <div class="basket_info">
                    <p class="bi_title">${name}</p>
                    <p class="bi_option">${allchoiceOption}</p>
                    <button onclick="openOptionModal(this)">옵션변경</button>
                </div>
                <div class="basket_quantity">
                    <button onclick="decreaseCount(this)">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="bq_count">${count}</span>
                    <button onclick="increaseCount(this)">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                <div class="bp_price">
                    <p>${(price * count).toLocaleString('ko-KR')}원</p>
                </div>

            </div>
        </li>`
  );
}

//상품 선택 클릭이벤트
function changeProduct() {
  renderPaymentAmount();
  checkAllSelect();
  localStorage.setItem('basketItemList', JSON.stringify(basketItemList));
}
window.changeProduct = changeProduct;

//상품 모두 선택되었으면 모두선택버튼 활성화
function checkAllSelect() {
  const li = $basketListWrap.querySelectorAll('li');
  let isChecked = true;
  li.forEach((el) => {
    const productCheckBox = el.querySelector('.basket_select>input');
    if (!productCheckBox.checked) {
      isChecked = false;
      basketItemList.find((obj) => obj.id == el.id).isChecked = false;
    } else {
      basketItemList.find((obj) => obj.id == el.id).isChecked = true;
    }
  });
  if (isChecked) {
    $allCheck.checked = true;
  } else {
    $allCheck.checked = false;
  }
}

//장바구니 상품 삭제
function deleteBasketLi(e) {
  const item = e.closest('.basket-list');
  basketItemList = basketItemList.filter((el) => el.id != item.id);
  localStorage.setItem('basketItemList', JSON.stringify(basketItemList));
  item.remove();
  renderPaymentAmount();
}
window.deleteBasketLi = deleteBasketLi;

//선택삭제
function deleteChoiceProduct() {
  const li = $basketListWrap.querySelectorAll('li');
  let targetArr = [];
  li.forEach((el) => {
    const productCheckBox = el.querySelector('.basket_select>input');
    if (productCheckBox.checked) {
      deleteBasketLi(el);
      renderPaymentAmount();
    }
  });
}
window.deleteChoiceProduct = deleteChoiceProduct;

//수량증가
function increaseCount(e) {
  const item = e.closest('.basket-list');
  const target = basketItemList.find((obj) => obj.id == item.id);
  target.count++;
  item.querySelector('.bq_count').innerHTML = `${target.count}`;
  item.querySelector('.bp_price>p').innerHTML = `${(target.count * target.price).toLocaleString('ko-KR')}원`;
  localStorage.setItem('basketItemList', JSON.stringify(basketItemList));
  renderPaymentAmount();
}
window.increaseCount = increaseCount;
//수량감소
function decreaseCount(e) {
  const item = e.closest('.basket-list');
  const target = basketItemList.find((obj) => obj.id == item.id);
  if (!(target.count < 2)) {
    target.count--;
    item.querySelector('.bq_count').innerHTML = `${target.count}`;
    item.querySelector('.bp_price>p').innerHTML = `${(target.count * target.price).toLocaleString('ko-KR')}원`;
    localStorage.setItem('basketItemList', JSON.stringify(basketItemList));
    renderPaymentAmount();
  }
}
window.decreaseCount = decreaseCount;

//옵션선택 모달창 오픈과 동시에 선택한 아이템의 객체값(정보) 불러와서 모달창 안에다가 뿌려주기
function openOptionModal(e) {
  const item = e.closest('.basket-list');
  const target = basketItemList.find((obj) => obj.id == item.id);
  $optionModal.classList.add('on');
  $optionModal.id = item.id;
  document.body.style.overflow = 'hidden'; //모달창 오픈시 스크롤 막음

  //선택한 옵션 전체 돌려서 글자 값 만들어주기
  let allchoiceOption = '';
  for (let key in target.choiceOption) {
    allchoiceOption += `${key} : ${target.choiceOption[key]} / `;
  }
  allchoiceOption = allchoiceOption.slice(0, -2);

  //모달창 안에 정보 넣어주기
  $optionModal.querySelector('.om_img>img').src = target.image;
  $optionModal.querySelector('.omp_name>h3').innerHTML = target.name;
  $optionModal.querySelector('.omp_name>p').innerHTML = allchoiceOption;
  $optionModal.querySelector('.om_option-list>p').innerHTML = allchoiceOption;
  $optionModal.querySelector('.om_amount>span').innerHTML = target.count;
  $optionModal.querySelector('.om_price>p').innerHTML = `${(target.count * target.price).toLocaleString('ko-KR')}원`;

  //상품 옵션 불러오기
  let targetAllOption = target.allOption;
  for (let key in targetAllOption) {
    let optionName = key;
    let optionArr = targetAllOption[key];
    $optionModal.querySelector('.om_choice-wrap').innerHTML += createAllOption(optionName, optionArr);
  }

  //모달창에서 상품 옵션 모두 선택 시 최종 옵션 변경, 옵션띄운 상품정보 넣어줌
  choiceOption(target);
}
window.openOptionModal = openOptionModal;

//모달닫기
function closeOptionModal() {
  $optionModal.classList.remove('on');
  document.body.style.overflow = 'auto';
  $optionModal.querySelector('.om_choice-wrap').innerHTML = ''; //옵션창 비워줘야댐
}
window.closeOptionModal = closeOptionModal;

//옵션창 수량증가
function increaseCountModal(e) {
  const item = e.closest('.option_modal');
  const target = basketItemList.find((obj) => obj.id == item.id);
  let currentCount = Number(item.querySelector('.om_amount>span').innerHTML);
  currentCount++;
  item.querySelector('.om_amount>span').innerHTML = currentCount;
  item.querySelector('.om_price>p').innerHTML = `${(currentCount * target.price).toLocaleString('ko-KR')}원`;
}
window.increaseCountModal = increaseCountModal;

//옵션창 수량감소
function decreaseCountModal(e) {
  const item = e.closest('.option_modal');
  const target = basketItemList.find((obj) => obj.id == item.id);
  let currentCount = Number(item.querySelector('.om_amount>span').innerHTML);

  if (!(currentCount < 2)) {
    currentCount--;
    item.querySelector('.om_amount>span').innerHTML = currentCount;
    item.querySelector('.om_price>p').innerHTML = `${(currentCount * target.price).toLocaleString('ko-KR')}원`;
  }
}
window.decreaseCountModal = decreaseCountModal;

//모달창 전체 옵션 리스트 dom 만들기
function createAllOption(key, arr) {
  let option = `<option value="" selected disabled>${key}</option>`;
  for (let i = 0; i < arr.length; i++) {
    option += `<option value="${i}">${arr[i]}</option>`;
  }

  return (
    /*html*/
    `<li class="om_choice">
            <select name="" id="">
                ${option}
            </select>
        </li>`
  );
}

//옵션모달창에서 옵션선택했는지 체크 후 옵션들 합쳐서 글자만들기
function choiceOption(item) {
  const selects = document.querySelectorAll('select');
  const option = {};
  selects.forEach((el) => {
    el.addEventListener('change', () => {
      option[el[0].innerText] = el.value;
      if (selects.length == Object.keys(option).length) {
        //선택한 옵션 전체 돌려서 글자 값 만들어주기
        let allchoiceOption = '';
        for (let key in option) {
          allchoiceOption += `${key} : ${item.allOption[key][option[key]]} / `;
        }
        allchoiceOption = allchoiceOption.slice(0, -2);

        $optionModal.querySelector('.om_option-list>p').innerHTML = allchoiceOption;
      }
    });
  });
}

//옵션모달창 확인버튼 누르면 객체정보 업데이트
function updateOption(e) {
  const item = e.closest('.option_modal');
  const target = basketItemList.find((obj) => obj.id == item.id);
  const selects = document.querySelectorAll('select');
  const currentChoiceOption = {};
  let isOptionSelected = true;

  selects.forEach((el) => {
    currentChoiceOption[el[0].innerText] = target.allOption[el[0].innerText][el.value];
  });

  Object.values(currentChoiceOption).forEach((el) => {
    if (el == undefined) {
      isOptionSelected = false;
    }
  });

  if (isOptionSelected) {
    target.count = Number(item.querySelector('.om_amount>span').innerHTML);
    target.choiceOption = {
      ...currentChoiceOption,
    };
    //리스트 초기화하고 업데이트된 객체로 다시 뿌려줌
    $basketListWrap.innerHTML = '';
    basketItemList.forEach((item) => {
      $basketListWrap.innerHTML += createBasketLi(item);
    });
    renderPaymentAmount();
    closeOptionModal();
    localStorage.setItem('basketItemList', JSON.stringify(basketItemList));
  } else {
    alert('옵션을 선택하세요');
  }
}
window.updateOption = updateOption;

//결제금액,상품개수 렌더
function renderPaymentAmount() {
  const $bsPrice = document.querySelector('.bs_price');
  const $productLength = document.querySelector('.purchase-button>span');
  const li = $basketListWrap.querySelectorAll('li');

  let targetIdArr = [];
  li.forEach((el) => {
    const productCheckBox = el.querySelector('.basket_select>input');
    if (productCheckBox.checked) {
      targetIdArr.push(el.id);
    }
  });
  let sum = targetIdArr.reduce((acc, cur) => {
    let targetProduct = basketItemList.find((obj) => obj.id == cur);
    let currentPrice = targetProduct.count * targetProduct.price;
    return acc + currentPrice;
  }, 0);

  $productLength.innerHTML = targetIdArr.length;
  $allChoiceProductPrice.innerHTML = `${sum.toLocaleString('ko-KR')}원`;
  $bsPrice.innerHTML = `${(sum + 3000).toLocaleString('ko-KR')}원`;
}
