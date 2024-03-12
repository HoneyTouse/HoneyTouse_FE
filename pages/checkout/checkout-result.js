import { URL } from '/assets/js/constants'

const jwt = localStorage.getItem('jwt');

const $orderNum = document.querySelector('.order_num');
const $orderDate = document.getElementById('orderDate');
const $receiverMemo = document.getElementById('receiverMemo');
const $receiverName = document.getElementById('receiverName');
const $receiverPhoneNumber = document.getElementById('receiverPhoneNumber');
const $receiverAddress = document.getElementById('receiverAddress');
const $ttlPriceList = Array.from(document.querySelectorAll('.payment_list .desc'));
const $ttlPriceItem = document.getElementById('ttlPriceItem');
const $ttlPriceDelivery = document.getElementById('ttlPriceDelivery');
const $ttlPrice = document.getElementById('ttlPrice');


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
            const { address, addressDetail, email, name, phoneNumber } = data;

            //값 넣어주기        
            //배송정보        
            $receiverName.textContent = name;
            $receiverPhoneNumber.textContent = autoHypenPhone(phoneNumber);
            $receiverAddress.textContent = address + ' ' + addressDetail;
        })
        .catch(error => {
            console.error('Error fetching data', error);
        });

    //orders에서 data 가져오기
    fetch(`${URL}/orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt
        }
    })
        .then(response => response.json())
        .then(object => {
            const datas = object.data;
            //data 객체에서 직전에 주문한 정보 가져오기 (마지막 요소)
            const thisOrder = datas[datas.length - 1];
            if (thisOrder) {
                // 선택한 객체의 값 가져오기
                const {
                    _id,
                    status,
                    customerId,
                    product: [
                        { id, count }
                    ],
                    memo,
                    payment: {
                        ttlPriceItem,
                        ttlPriceDelivery,
                        ttlPrice
                    },
                    createdAt,
                    updatedAt
                }
                    = thisOrder;

                // 가져온 데이터 확인
                // 데이터 입력
                $receiverMemo.textContent = memo;
                $orderNum.textContent = createdAt.slice(0, 10) + '-' + _id.slice(0, 6);
                $ttlPriceItem.textContent = ttlPriceItem;
                $ttlPriceDelivery.textContent = ttlPriceDelivery;
                $ttlPrice.textContent = ttlPrice;
                // 숫자데이터 정리
                $ttlPriceList.slice(0, 3).forEach(paymentList);
                $orderDate.textContent = createdAt.replace('T', ' ').slice(0, 19);
            } else {
                console.log("해당 _id 값을 가진 주문을 찾을 수 없습니다.");
            }
        })
        .catch(error => {
            console.error('Error fetching data', error);
        });
} else {
    const geustUser = JSON.parse(localStorage.getItem('geustUser'));
    const params = new URLSearchParams(window.location.search);
    const guestId = params.get('param1');
    //orders에서 data 가져오기
    fetch(`${URL}/orders/${guestId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(object => {
            const datas = object.data;

            //data 객체에서 직전에 주문한 정보 가져오기 (마지막 요소)
            if (datas) {
                $receiverName.textContent = geustUser.receiverName;
                $receiverPhoneNumber.textContent = geustUser.receiverPhoneNumber;
                $receiverAddress.textContent = geustUser.receiverAddress + ' ' + geustUser.receiverAddressDetail;
                // 선택한 객체의 값 가져오기
                const {
                    _id,
                    status,
                    customerId,
                    product: [
                        { id, count }
                    ],
                    memo,
                    payment: {
                        ttlPriceItem,
                        ttlPriceDelivery,
                        ttlPrice
                    },
                    createdAt,
                    updatedAt
                }
                    = datas;

                // 가져온 데이터 확인
                // 데이터 입력
                $receiverMemo.textContent = memo;
                $orderNum.textContent = createdAt.slice(0, 10) + '-' + _id.slice(0, 6);
                $ttlPriceItem.textContent = ttlPriceItem;
                $ttlPriceDelivery.textContent = ttlPriceDelivery;
                $ttlPrice.textContent = ttlPrice;
                // 숫자데이터 정리
                $ttlPriceList.slice(0, 3).forEach(paymentList);
                $orderDate.textContent = createdAt.replace('T', ' ').slice(0, 19);
            } else {
                console.log("해당 _id 값을 가진 주문을 찾을 수 없습니다.");
            }
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
