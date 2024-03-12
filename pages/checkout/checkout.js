import { URL } from '/assets/js/constants'

//###주문자 user 정보 가져오기###
//jwt 가져오기
const jwt = localStorage.getItem('jwt');

const $userName = document.getElementById('userName');
const $userPhoneNumber = document.getElementById('userPhoneNumber');
const $userEmail = document.getElementById('userEmail');

const $receiverName = document.getElementById('receiverName');
const $receiverPhoneNumber = document.getElementById('receiverPhoneNumber');
const $receiverAddress = document.getElementById('receiverAddress');
const $receiverAddressDetail = document.getElementById('receiverAddressDetail');
const $receiverMemo = document.getElementById('receiverMemo');

if (jwt) {
    fetch(`${URL}/auth/me`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jwt
        }
    })
        .then(response => response.json())
        .then(object => {
            const data = object.data;
            //data 객체에서 각 데이터값 가져오기
            const { address, addressDetail, email, name, phoneNumber } = data;

            //값 넣어주기
            //주문자정보
            $userName.value = name;
            $userPhoneNumber.value = autoHypenPhone(phoneNumber);
            $userEmail.value = email;

            //배송정보        
            $receiverName.value = name;
            $receiverPhoneNumber.value = autoHypenPhone(phoneNumber);
            $receiverAddress.value = address;
            $receiverAddressDetail.value = addressDetail;

            //jwt가 있을 경우 input에 readonly속성 부여
            const $inputEl = document.querySelectorAll('.info input');
            $inputEl.forEach(inputEl => {
                inputEl.setAttribute('readonly', '');
            });
            $receiverMemo.removeAttribute('readonly');
        })
        .catch(error => {
            console.error('Error fetching data', error);
        });
}

// -----------------------------------------------------------------------
//###checkbox로 주문자 정보 동일하게 가져오기###
const $getCustomerDataCheckbox = document.getElementById('getCustomerData');

$getCustomerDataCheckbox.addEventListener('click', function () {
    // 클릭했을 때, 특정 input 요소들의 value 값을 설정하는 코드
    $receiverName.value = $userName.value;
    $receiverPhoneNumber.value = $userPhoneNumber.value;
});

// -----------------------------------------------------------------------
//###주소 스크립트###
//ja_find
const $jaFindBtn = document.querySelector('.ja_find');
$jaFindBtn.addEventListener("click", (e) => {
    e.preventDefault();
    join_execDaumPostcode();
})

function join_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function (data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === 'R') {
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('receiverPostcode').innerText = data.zonecode;
            document.getElementById("receiverAddress").value = addr + extraAddr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("receiverAddressDetail").focus();
        }
    }).open();
}

// -----------------------------------------------------------------------
//###전화번호 입력 시 하이픈 추가하기###
const $phoneInput = document.getElementById('receiverPhoneNumber');

$phoneInput.addEventListener('input', function (event) {
    const target = event.target;
    target.value = autoHypenPhone(target.value);
});

function autoHypenPhone(str) {
    return str
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{3})(\d{0,4})/, '$1-$2')
        .replace(/^(\d{3})-(\d{4})(\d{0,4})/, '$1-$2-$3');
}

// -----------------------------------------------------------------------

//###장바구니의 주문상품 정보를 가져오는 이벤트###
//로컬스토리지 데이터 가져오기
const basketItemList = JSON.parse(localStorage.getItem('basketItemList'));
//data 확인

//받은 정보들을 article로 만들어 .info-product에 넣는 함수
const $orderedProducts = document.querySelector('.info-product #itemList');
let choiceOptionStr = '';
function createArticle(item) {
    //선택한 옵션 1줄로 만들기
    choiceOptionStr =
        `
    ${Object.entries(item.choiceOption).map(([key, value]) =>
            `${key}: ${value}`).join(', ')
        }
    `;

    $orderedProducts.innerHTML +=
        `
    <article class="section_content">
        <div class="info_line">
        <div class="product_img">
            <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="product_detail">
            <p class="name">${item.name}</p>
            <p class="option sub-text">${choiceOptionStr}</p>
            <p class="price">
            ${item.price.toLocaleString()}원
            <span class="qty sub-text">${item.count}개</span>
            </p>
        </div>
        </div>
    </article>
    <hr />
    `;
}


//basketItemList의 data 가져와서 넣기
let totalPriceItem = 0; //결제금액 계산용
basketItemList.forEach(item => {
    if (item.isChecked) {
        createArticle(item);
        totalPriceItem += item.count * item.price;
    }
});

// 결제 금액 넣기
const $ttlPriceList = Array.from(document.querySelectorAll('.payment_list .desc'));
const $ttlPriceItem = document.getElementById('ttlPriceItem');
const $ttlPriceDelivery = document.getElementById('ttlPriceDelivery');
const $ttlPrice = document.getElementById('ttlPrice');
const $btnCheckout = document.getElementById('btnCheckout');

$ttlPriceItem.textContent = totalPriceItem;
$ttlPriceDelivery.textContent = 3000;
$ttlPrice.textContent = (totalPriceItem + Number(ttlPriceDelivery.textContent));

$ttlPriceList.forEach(paymentList);
$btnCheckout.innerHTML = `<b>${$ttlPrice.textContent}</b> 결제하기`;

//결제금액부분 정리하는 공통 함수
function paymentList(el) {
    // 0. 요소의 내용 가져오기 (양쪽 공백 제거)
    let content = el.textContent.trim();

    // 1. 내용이 비어있을 때 숫자 0을 넣어주기
    if (content === '') {
        content = '0';
    }

    // 2. 내용이 숫자값인지 확인하고, 숫자로 변환하여 .toLocaleString()을 적용
    const numberValue = parseFloat(content);
    if (!isNaN(numberValue)) { // 숫자인 경우
        content = numberValue.toLocaleString();
    }

    // 3. 내용 뒤에 '원'을 추가 후, 변환된 내용을 다시 요소에 넣기
    el.textContent = content + '원';
};

//마지막 hr태그 삭제하기
$orderedProducts.lastElementChild.remove();

//주문상품 갯수 세기
function countArticles() {
    const products = $orderedProducts.querySelectorAll('article');
    return products.length;
}
// 갯수 text로 넣기
document.getElementById('orderQty').innerText = countArticles() + '건';

// -----------------------------------------------------------------------
//###form의 정보를 넘기는 submit이벤트###
function registerOrder(evt) {
    evt.preventDefault(); // 폼 제출 이벤트 중지
    //입력된 값 가져오기
    const product = basketItemList.map((item) => {
        return {
            id: item.id,
            name: item.name,
            count: item.count,
            image: item.image,
            options: item.options._id
        }
    });

    const memo = evt.target.memo.value;
    const ttlPriceItem = totalPriceItem;
    const ttlPriceDelivery = 3000;
    const ttlPrice = ttlPriceItem + ttlPriceDelivery;

    // 수령인 정보를 객체로 저장
    const orderData = {
        status: '결제 완료',
        product,
        memo,
        payment: {
            ttlPriceItem,
            ttlPriceDelivery,
            ttlPrice
        }
    };
    // 주문 정보를 서버로 전송
    if (jwt) {
        fetch(`${URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify(orderData),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // 요청이 성공하면 다른 페이지로 이동
            window.location.href = './result.html';
        })
            .catch(error => console.error('Error:', error));
    } else {
        fetch(`${URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        }).then(response => response.json())
            .then(data => {
                const geustUser = {
                    userName: $userName.value,
                    userPhoneNumber: $userPhoneNumber.value,
                    userEmail: $userEmail.value,
                    receiverName: $receiverName.value,
                    receiverPhoneNumber: $receiverPhoneNumber.value,
                    receiverAddress: $receiverAddress.value,
                    receiverAddressDetail: $receiverAddressDetail.value,
                };
                localStorage.setItem('geustUser', JSON.stringify(geustUser));
                window.location.href = `/checkout/result.html?param1=${data.data._id}`;
            })
            .catch(error => console.error('Error:', error));
    }


}

document.querySelector('form').addEventListener('submit', registerOrder);