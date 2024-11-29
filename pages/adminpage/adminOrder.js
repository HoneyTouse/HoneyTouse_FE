import { makeFetchRequest } from '../assets/js/api';
import { URL } from '../assets/js/constants';

document.addEventListener('DOMContentLoaded', function () {
  // 주문 관리 버튼 클릭 시 주문 페이지 표시
  document.getElementById('orderBtn').addEventListener('click', function () {
    fetchOrdersPage();
  });
});

// 주문 관리 페이지 표시 함수
async function fetchOrdersPage() {
  const jwt = localStorage.getItem('jwt');

  try {
    // 주문 목록 조회 API를 호출하여 주문 상태별 버튼을 동적으로 생성
    const data = await makeFetchRequest(`${URL}/admin/orders`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + jwt,
      },
    });

    const orders = data.data;
    const statusCounts = {
      '입금 대기': orders.filter((item) => item.status === '입금 대기').length,
      '결제 완료': orders.filter((item) => item.status === '결제 완료').length,
      '배송 준비': orders.filter((item) => item.status === '배송 준비').length,
      '배송 중': orders.filter((item) => item.status === '배송 중').length,
      '배송 완료': orders.filter((item) => item.status === '배송 완료').length,
      '구매 확정': orders.filter((item) => item.status === '구매 확정').length,
    };

    document.getElementById('content').innerHTML = `
      <div id="order-button">
        ${Object.entries(statusCounts)
          .map(
            ([status, count]) => `
            <button onclick="fetchOrdersByStatus('${status}')">${status}</br>${count}</button>
          `,
          )
          .join('')}
      </div>
    `;
  } catch (error) {
    console.error('주문 관리 페이지를 가져오는 중 오류 발생:', error);
  }
}

// 주문 상태별 주문 가져오기 함수
window.fetchOrdersByStatus = async function fetchOrdersByStatus(status) {
  const jwt = localStorage.getItem('jwt');

  try {
    const data = await makeFetchRequest(`${URL}/admin/orders/status?status=${encodeURIComponent(status)}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + jwt,
      },
    });

    const orders = data.data;
    document.getElementById('content').innerHTML = `
          <div id="order-list">
          ${orders
            .map(
              (order) =>
                `
                <ul>
                <li><strong>주문ID:</strong> ${order._id}</li>
                <li><strong>주문상태:</strong> ${order.status}</li>
                <li><strong>주문자ID:</strong> ${order.customerId}</li>
                <li><strong>주문상품ID:</strong> ${order.product ? order.product.id : '없음'}</li>
                <li><strong>주문 수량:</strong> ${order.product ? order.product.count : '없음'}</li>
                <li><strong>주문 메모:</strong> ${order.memo}</li>
              </ul>
              <button onclick="editOrder('${order._id}', '${order.status}', '${order.memo}')">수정</button>
              <button onclick="deleteOrder('${order._id}')">삭제</button>
`,
            )
            .join('')}
          </div>
          `;
  } catch (error) {
    console.error(`주문 상태가 ${status}인 주문을 가져오는 중 오류 발생:`, error);
  }
};

// 주문 수정 함수
window.editOrder = async function editOrder(orderId, status, memo) {
  const newStatus = prompt('새로운 주문 상태를 입력하세요:', status);
  const newMemo = prompt('새로운 주문 메모를 입력하세요:', memo);

  if (newStatus === null || newStatus.trim() === '' || newMemo === null || newMemo.trim() === '') {
    return;
  }

  const updatedData = {
    status: newStatus,
    memo: newMemo,
  };
  const jwt = localStorage.getItem('jwt');

  try {
    await makeFetchRequest(`${URL}/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt,
      },
      body: JSON.stringify(updatedData),
    });

    fetchOrdersPage(); // 수정 후 페이지 다시 로드
  } catch (error) {
    console.error('주문 수정 중 오류 발생:', error);
  }
};

// 주문 삭제 함수
window.deleteOrder = async function deleteOrder(id) {
  if (!confirm('정말로 삭제하시겠습니까?')) return;

  const jwt = localStorage.getItem('jwt');

  try {
    await makeFetchRequest(`${URL}/admin/orders/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + jwt,
      },
    });

    fetchOrdersPage(); // 삭제 후 페이지 다시 로드
  } catch (error) {
    console.error('주문 삭제 중 오류 발생:', error);
  }
};
