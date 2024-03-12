import {URL} from '../assets/js/constants'

// 페이지가 로드될 때 상품 정보를 표시
window.addEventListener('DOMContentLoaded', async () => {
  let productId
  try {
    const urlParams = new URLSearchParams(window.location.search)
    productId = urlParams.get('id')
    const pdtData = await fetchPdtData(productId)
    displayPdtInfo(pdtData)
  } catch (error) {
    console.error('상품 정보를 표시하는 중 오류가 발생했습니다:', error)
  }
})

// Fetch된 상품 정보를 저장
const pdtDataCache = {}
async function fetchPdtData(productId) {
  if (pdtDataCache[productId]) {
    return pdtDataCache[productId]
  } else {
    const res = await fetch(`${URL}/products/${productId}`)
    if (!res.ok) {
      throw new Error('상품 데이터를 가져오는데 실패하였습니다.')
    }
    const pdtData = await res.json()
    pdtDataCache[productId] = pdtData
    return pdtData
  }
}

function displayPdtInfo(pdtData) {
  if (pdtData) {
    const pdt = pdtData.data
    console.log(pdt)
    document.querySelector('.pdt-brand').textContent = pdt.brand
    document.querySelector('.pdt-name').textContent = pdt.name
    document.querySelector('.pdt-number').textContent = `${pdt.price.toLocaleString('ko-KR')}`
    document.querySelector('.pdt-selling-description_content').innerHTML = `
      <p style="text-align: center;">
        <img src="${pdt.description}" alt="상품의 상세 설명 이미지">
      </p>`
    document.querySelector('.pdt-selling-cover-list').innerHTML = `
      <div class="pdt-selling-cover-image_entry">
          <img class="bsImage" src="${pdt.image}" alt="${pdt.name}"/>
      </div>`
    createOptionSelectors(pdt.options)
  }
}

async function extractProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (!productId) {
    throw new Error('URL에서 상품 ID를 추출하는 데 실패했습니다.');
  }
  return productId
}

function createOptionSelectors(options) {
  const $optionContainer = document.querySelector('.selling-option-select-input_option')
  if (!$optionContainer) {
    console.error('.selling-option-select-input_option 요소를 찾을 수 없습니다.')
    return
  }

  // options가 배열이 아닌 경우 배열로 변환
  if (!Array.isArray(options)) {
    options = [options]
  }

  // select 요소를 생성
  options.forEach(option => {
    const { name, value } = option
    const optionSelect = document.createElement('select')
    optionSelect.id = `${name}Options`
    optionSelect.classList.add('pdt-option-select')
    optionSelect.innerHTML = `<option value="">-- ${name} 선택 --</option>`

    // value를 옵션으로 추가
    value.forEach(optionValue => {
      const optionEl = document.createElement('option')
      optionEl.value = optionValue
      optionEl.textContent = optionValue
      optionSelect.appendChild(optionEl)
    })
    $optionContainer.appendChild(optionSelect)
  })
}

// 선택된 옵션을 저장하기 위한 객체
const selectedOptions = []
const $optionContainer = document.querySelector('.selling-option-select-input_option')
const $optionList = document.getElementById('optionList')
// 옵션 선택 시 처리
$optionContainer.addEventListener("change", async () => {
  try {
    const productId = await extractProductIdFromURL()
    const allSelects = Array.from($optionContainer.querySelectorAll('select'))
    const allValues = allSelects.map(select => select.value)

    if (allValues.length > 0) {
      const pdtData = await fetchPdtData(productId)
      const selectedPdt = pdtData.data
      // 선택된 옵션 초기화
      const selectedOptionsForThisProduct = allValues.join('-')
      const isOptionAlreadySelected = selectedOptions.includes(selectedOptionsForThisProduct)
      if (!isOptionAlreadySelected) {
        // 옵션 정보 추가
        $optionList.innerHTML += `
          <li data-option="${selectedOptionsForThisProduct}">
            <h3 class="pdt-title">${selectedPdt.name}</h3>
            <div class="pdt-options">
              ${allValues.map(value => `<span>${value}</span>`).join('')}
            </div>
              <button>
                <i class="fa-solid fa-xmark"></i>
              </button>
            <div class="pdt-info-container-inner">
              <div class="pdt-quantity">
                <button>
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="pdt_count">1</span>
                <button>
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div> 
              <div class="pdt_price">
                <p>${selectedPdt.price.toLocaleString('ko-KR')}원</p>
              </div>
            </div> 
          </li>
        `
        selectedOptions.push(selectedOptionsForThisProduct)
        updateOrderPrice()
      } else {
        alert('이미 선택된 옵션입니다.')
      }
      allSelects.forEach(select => {
        select.selectedIndex = 0
      })
    }
  } catch (error) {
    console.error('상품 정보를 표시하는 중 오류가 발생했습니다:', error)
  }
})

// 수량 증가
function pdtIncreaseCount(button) {
  const li = button.closest('li')
  if (li) {
    const pdtCount = li.querySelector('.pdt_count')
    let count = parseInt(pdtCount.textContent)
    count++;
    pdtCount.textContent = count
    updatePrice(li, count)
  }
}

// 수량 감소
function pdtDecreaseCount(button) {
  const li = button.closest('li')
  if (li) {
    const pdtCount = li.querySelector('.pdt_count')
    let count = parseInt(pdtCount.textContent)
    if (count > 1) {
      count--;
      pdtCount.textContent = count;
      updatePrice(li, count);
    }
  }
}

//옵션 삭제
function deleteOptionLi(button) {
  const li = button.closest('li')
  if (li) {
    const optionKey = li.getAttribute('data-option')

    // 선택된 옵션 배열에서 제거
    const index = selectedOptions.indexOf(optionKey)
    if (index !== -1) {
      selectedOptions.splice(index, 1)
    }
    li.remove()
    enableOption(optionKey)
    updateOrderPrice()
  }
}

// 삭제된 옵션을 다시 사용 가능하도록 설정
function enableOption(optionKey) {
  if (optionKey) {
      const optionValues = optionKey.split('-')
      const allSelects = Array.from($optionContainer.querySelectorAll('select'))
      allSelects.forEach(select => {
          const optionType = select.id.replace('Options', '')
          const optionValue = optionValues.find(value => value.startsWith(optionType))
          // 현재 선택된 옵션이 삭제된 옵션이면 다시 사용 가능하도록 설정
          if (optionValue) {
              const optionElement = select.querySelector(`option[value="${optionValue}"]`)
              if (optionElement) {
                  optionElement.disabled = false
              }
          }
      })
  }
}

// 이벤트 핸들러 추가
document.addEventListener('click', function(event) {
  const target = event.target;
  if (target.matches('.fa-plus')) {
    pdtIncreaseCount(target);
  } else if (target.matches('.fa-minus')) {
    pdtDecreaseCount(target);
  } else if (target.matches('.fa-xmark')) {
    deleteOptionLi(target)
  }
})

// 가격 업데이트 
async function updatePrice(li, count) {
  const pdtPrice = li.querySelector('.pdt_price p')
  const productId = await extractProductIdFromURL()
  const pdtData = await fetchPdtData(productId)
  const selectedPdt = pdtData.data
  const pricePerItem = selectedPdt.price
  const totalPrice = count * pricePerItem
  pdtPrice.textContent = totalPrice.toLocaleString('ko-KR') + '원'
  updateOrderPrice()
}

// 총 주문 금액 업데이트
function updateOrderPrice() {
  const $allLiItems = $optionList.querySelectorAll('li')
  let totalPrice = 0
  $allLiItems.forEach(li => {
    const pdtPrice = li.querySelector('.pdt_price p')
    const priceText = pdtPrice.textContent.trim();
    const priceValue = parseInt(priceText.replace('원', '').replace(/,/g, ''))
    totalPrice += priceValue
  })
  const $pdtOrderPrice = document.querySelector('.pdt-order-price')
  $pdtOrderPrice.textContent = totalPrice.toLocaleString('ko-KR') + '원'
}

// 데이터 저장
async function addToBasket() {
  try {
    const productId = await extractProductIdFromURL()
    const pdtData = await fetchPdtData(productId)
    const $selectedOptionsEls = Array.from(document.querySelectorAll('#optionList li'))

    let basketItemList = JSON.parse(localStorage.getItem('basketItemList')) ?? []

    $selectedOptionsEls.forEach(optionEl => {
      const selectedOptions = Array.from(optionEl.querySelectorAll('.pdt-options span'))
      const option = selectedOptions.map(span => span.textContent.split(" ")[0]).join(' ').trim()
      const count = parseInt(optionEl.querySelector(".pdt_count").textContent)
      const priceText = optionEl.querySelector('.pdt_price p').textContent
      const price = parseInt(priceText.slice(0, -1).replace(/\D/g, ''))
    
      basketItemList.push({
        ...pdtData.data,
        id: pdtData.data._id,
        count,
        isChecked: false,
        allOption: {
          [pdtData.data.options?.name]: pdtData.data.options?.value,
        },
        choiceOption: {
          [pdtData.data.options?.name]: option,
        },
        price
      })
    })
    localStorage.setItem('basketItemList', JSON.stringify(basketItemList))
  } catch (error) {
    console.error('장바구니에 상품을 추가하는 중 오류가 발생했습니다:', error)
  }
}

//바로구매
const $pdtBuyBtn = document.getElementById('pdtBuyBtn')
$pdtBuyBtn.addEventListener('click', function() {
  const $selectedOptionsEls = document.querySelectorAll('#optionList li')
  if($selectedOptionsEls.length > 0) {
    addToBasket()
    window.location.href = "/checkout/"
  } else {
    alert("옵션을 선택해 주세요.")
  }
})

//장바구니
document.addEventListener("DOMContentLoaded",function() {
  const $pdtBasketBtn = document.getElementById('pdtBasketBtn')
  const $pdtmodal = document.querySelector('.alertly')
  const $goShoppingBtn = document.getElementById('goShoppingBtn')
  const $goBasketBtn = document.getElementById('goBasketBtn')

  $pdtBasketBtn.addEventListener('click', function() { 
    const selectedOPtionsEls = document.querySelectorAll('#optionList li')
    if(selectedOPtionsEls.length > 0) {
      //장바구니에 정보 전달
      addToBasket()
      $pdtmodal.style.display = 'block'
    } else {
      alert("옵션을 선택해 주세요.")
    }
  })

  $optionContainer.addEventListener('change', function() {
    updateBasketBtn()
  })

  function updateBasketBtn() {
    const selectedOPtionsEls = document.querySelectorAll('#optionList li')
    if(selectedOPtionsEls.length > 0) {
      $pdtBasketBtn.disabled = false
    } else {
      $pdtBasketBtn.disabled = true
    }
  }

  $goShoppingBtn.addEventListener('click', function() {
    $pdtmodal.style.display = 'none'
  })

  $goBasketBtn.addEventListener("click", function() {
    window.location.href = "/basket/"
  })
})

// nav 클릭 이벤트
const $navItems = document.querySelectorAll('.pdt-selling-nav_item')
$navItems.forEach(function(item) {
    item.addEventListener('click', function() {
        $navItems.forEach(function(navItem) {
            navItem.classList.remove('pdt-selling-nav_item-active')
        })
        this.classList.add('pdt-selling-nav_item-active');

        setTimeout(function() {
            item.classList.remove('pdt-selling-nav_item-active')
        }, 2500)
    })
})

//totop옵션
const $toTopEl = document.getElementById("toTop")
function handleScroll() {
  if (document.documentElement.scrollTop > 100) {
    $toTopEl.style.display = "block"
  } else {
    $toTopEl.style.display = "none"
  }
}
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
  document.documentElement.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}
$toTopEl.addEventListener('click', function() {
  scrollToTop()
})
document.addEventListener('scroll', handleScroll)

