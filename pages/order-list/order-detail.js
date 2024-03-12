import { URL } from '/assets/js/constants';

// 페이지가 로드될 때 주문 정보를 표시
window.addEventListener('DOMContentLoaded', async () => {
    let orderId
    try {
      const urlParams = new URLSearchParams(window.location.search)
      orderId = urlParams.get('id')
      const OrderData = await fetchOrderData(orderId)
      displayOrderInfo(OrderData)
    } catch (error) {
      console.error('주문 정보를 표시하는 중 오류가 발생했습니다:', error)
    }
})

// Fetch된 주문 정보를 저장
const OrderDataCache = {}
async function fetchOrderData(orderId) {
    if (OrderDataCache[orderId]) {
        return OrderDataCache[orderId];
    } else {
        try {
            const res = await fetch(`${URL}/orders/${orderId}`);
            if (!res.ok) {
                throw new Error('주문 데이터를 가져오는데 실패하였습니다.');
            }
            const OrderData = await res.json();
            
            OrderDataCache[orderId] = OrderData;
            return OrderData;
        } catch (error) {
            console.error('주문 데이터를 가져오는 중 오류가 발생했습니다:', error);
            throw error; // 오류를 재throw하여 호출자에게 전파
        }
    }
}

function displayOrderInfo(OrderData) {
    if (OrderData) {
        const Order = OrderData.data
        console.log(Order)
        document.querySelector('.order-status').textContent = Order.status;
        document.querySelector('.order-status').innerHTML += `
            <span class="_date sub-text">${Order.updatedAt.slice(0, 10)}</span>
        `;
        document.querySelector('#receiverMemo').textContent = Order.memo;
        document.querySelector('.order_date').textContent = Order.createdAt.slice(0, 10);
        document.querySelector('.order_num').textContent = `
        (주문번호 : ${Order.createdAt.replace('T', ' ').slice(0, 19)}-${Order._id.slice(0, 6)})
        `;
        document.querySelector('#ttlPriceItem').textContent = Order.payment.ttlPriceItem;
        document.querySelector('#ttlPriceDelivery').textContent = Order.payment.ttlPriceDelivery;
        document.querySelector('#ttlPrice').textContent = Order.payment.ttlPrice;
        document.querySelector('#orderDate').textContent = Order.createdAt.replace('T', ' ').slice(0, 19)
        
        const $ttlPriceList = Array.from(document.querySelectorAll('.payment_list .desc'));
        $ttlPriceList.slice(0, 3).forEach(paymentList);

        //상품정보 가져오기
        // item.product 배열 순회
        Promise.all(Order.product.map(productItem => {
            let productId = productItem.id;

            return fetch(`${URL}/products/` + productId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(pdtObject => {
                const product = pdtObject.data;
                console.log(product);

                // articleHTML 변수에 값을 추가합니다.
                if(product){
                    document.querySelector('.ordered-products').innerHTML += `
                        <li class="info_line">
                            <div class="product_img">
                                <a href="/pdt-info/?id=${product._id}">
                                    <img src="${product.image}" alt="${product.name}" />
                                </a>
                            </div>
                            <div class="product_detail">
                                <p class="name">${product.name}</p>
                                <p class="option sub-text">${product.options.name}: ${product.options.value[0]}</p>
                                <p class="price">
                                    ${(product.price).toLocaleString()} 원
                                    <span class="qty sub-text">${productItem.count}개</span>
                                </p>
                            </div>
                        </li>
                    `;
                }
            });
        }))
        .then(() => {
            document.querySelector('.ordered-products').innerHTML += `</ul>`;
            // 각 객체의 status값에 따라 button 생성
            let btnHTML = `<ul class="btn-list">` + createBtnList(Order) + `</ul>`;
            document.querySelector('.order_content').innerHTML += btnHTML;

            // 생성한 section을 문서에 추가
            document.querySelector('.ordered-products').innerHTML += `
                        </div>
                    </article>
                </li>
            </ul>`;
        })
        .catch(error => {
            console.error('Error fetching data', error);
        });
    }
}

async function extractorderIdFromURL() {
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('id');
if (!orderId) {
    throw new Error('URL에서 주문 ID를 추출하는 데 실패했습니다.');
}
return orderId;
}

//금액 정리해주는 함수
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


const jwt = localStorage.getItem('jwt');
const $receiverName = document.getElementById('receiverName');
const $receiverPhoneNumber = document.getElementById('receiverPhoneNumber');
const $receiverAddress = document.getElementById('receiverAddress');

//jwt로 user정보 가져오기
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
        console.log(object.data);
        const { address, addressDetail, name, phoneNumber } = data;

        //값 넣어주기        
        //배송정보        
        $receiverName.textContent = name;
        $receiverPhoneNumber.textContent = autoHypenPhone(phoneNumber);
        $receiverAddress.textContent = address + ' ' + addressDetail;
    })
    .catch(error => {
        console.error('Error fetching data', error);
    });
}

//함수 리스트
function autoHypenPhone(str) {
    return str
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{3})(\d{0,4})/, '$1-$2')
        .replace(/^(\d{3})-(\d{4})(\d{0,4})/, '$1-$2-$3');
}

function createBtnList(item) {
    if(item.status === '배송 중') {
        console.log('배송 중');
        return `
        <li>
            <button class="btn-order-detail" id="btnTracking">배송 조회</button>
        </li>
        `;
    } else if(item.status === '배송 완료') {
        console.log('배송 완료');
        return `
        <li>
            <button class="btn-order-detail" id="btnTracking">배송 조회</button>
        </li>
        <li>
            <button class="btn-order-detail" id="btnReturnOrder">교환 반품</button>
        </li>
        `;
    } else if(item.status === '구매 확정') {
        console.log('구매 확정');
        return;
    } else {
        console.log('그 외');
        return `
        <li>
            <button class="btn-order-detail" id="btnModifyOrder">주문 수정</button>
        </li>
        <li>
            <button class="btn-order-detail" id="btnCancleOrder">주문 취소</button>
        </li>
        `
    }
}