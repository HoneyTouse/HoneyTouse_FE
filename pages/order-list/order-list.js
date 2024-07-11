import { URL } from '/assets/js/constants';

const jwt = localStorage.getItem('jwt');

const $orders = document.getElementById('orders');

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
        // 가져온 데이터 확인
    // 숫자데이터 정리
    if (datas) {
        datas.forEach(item => {
            // 각 객체의 데이터에 접근하여 section 생성
            let sectionHTML = `
                <li class="info-product info-order">
                    <div class="section_title">
                        <h2>${item.createdAt.slice(0, 10)}</h2>
                    </div>
                    <article class="section_content order-in-progress wrap">
                        <p class="order-status">
                            ${item.status}<span class="_date sub-text">${item.updatedAt.slice(0, 10)}</span>
                            <a href="./detail.html?id=${item._id}"><span>상세보기 >></span></a>
                        </p>
                    <div class="order_content">
                        <ul class="ordered-products">
            `;
        
            // item.product 배열 순회
            Promise.all(item.product.map(productItem => {
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
        
                    // articleHTML 변수에 값을 추가합니다.
                    if(product){
                        sectionHTML += `
                            <li class="info_line">
                                <div class="product_img">
                                    <a href="/pdt-info/index.html?id=${product._id}">
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
                sectionHTML += `</ul>`;
                // 각 객체의 status값에 따라 button 생성
                let btnHTML = `<ul class="btn-list">` + createBtnList(item) + `</ul>`;
                sectionHTML += btnHTML;
        
                // 생성한 section을 문서에 추가
                sectionHTML += `
                            </div>
                        </article>
                    </li>
                </ul>`;
                $orders.innerHTML += sectionHTML;

                // 주문삭제 이벤트
                // document.querySelectorAll('#btnCancleOrder').forEach(button => {
                //     button.addEventListener('click', function() {
                //         console.log('클릭!')
                //       const orderIdToDelete = this.closest('li').getAttribute('order-id');
                      
                //       // 주문 삭제 요청 보내기
                //       fetch(`${URL}/api/v1/orders/:${orderIdToDelete}`, {
                //         method: 'DELETE',
                //       })
                //         .then(response => {
                //           if (!response.ok) {
                //             throw new Error('Failed to delete order');
                //           }
                //           return response.json();
                //         })
                //         .then(data => {
                //           console.log('Deleted order:', data);
                //           // 주문이 성공적으로 삭제되었을 때 수행할 작업을 여기에 추가합니다.
                //         })
                //         .catch(error => {
                //           console.error('Error deleting order:', error);
                //         });
                //     });
                //   });
            })
            .catch(error => {
                console.error('Error fetching data', error);
            });
        });
    } else {
        console.log("해당 _id 값을 가진 주문을 찾을 수 없습니다.");
    }
})
.catch(error => {
    console.error('Error fetching data', error);
});

function createBtnList(item) {
    if(item.status === '배송 중') {
        return `
        <li>
            <button class="btn-order-detail" id="btnTracking">배송 조회</button>
        </li>
        `;
    } else if(item.status === '배송 완료') {
        return `
        <li>
            <button class="btn-order-detail" id="btnTracking">배송 조회</button>
        </li>
        <li>
            <button class="btn-order-detail" id="btnReturnOrder">교환 반품</button>
        </li>
        `;
    } else if(item.status === '구매 확정') {
        return;
    } else {
        return `
        <li>
            <button class="btn-order-detail" id="btnModifyOrder">주문 수정</button>
        </li>
        <li order-id="${item._id}">
            <button class="btn-order-detail" id="btnCancleOrder">주문 취소</button>
        </li>
        `
    }
}


// // 날짜 필터링 함수
// function filterOrdersByDate(selectedDate) {
//     const $order = document.querySelectorAll('#orders li'); // 모든 주문 목록 가져오기
//     console.log($order)
//     console.log('selected' + selectedDate)
//     $order.forEach(item => {
//       const orderDate = item.querySelector('h2').textContent; // 각 주문의 날짜 가져오기
//       if (selectedDate === 'all' || orderDate === selectedDate) {
//         console.log('orderDate' + orderDate)
//         item.classList.remove('hidden'); // 선택된 날짜와 일치하거나 전체 옵션이면 보이기
//       } else {
//         console.log('orderDate' + orderDate)
//         item.classList.add('hidden'); // 선택된 날짜와 일치하지 않으면 숨기기
//       }
//     });
//   }
  
//   // 날짜 필터링 이벤트 리스너 등록
//   document.getElementById('dateFilter').addEventListener('change', function() {
//     const selectedDate = this.value; // 선택된 날짜 가져오기
//     filterOrdersByDate(selectedDate); // 선택된 날짜로 주문 필터링
//   });


