import { URL } from '../assets/js/constants';
import { makeFetchRequest } from '../assets/js/api.js';

window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('categoryBtn').addEventListener('click', function () {
    fetchCategoriesPage();
  });
});

function fetchCategoriesPage() {
  makeFetchRequest(`${URL}/categories`, {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('access_token'),
    },
  })
    .then((data) => {
      const categories = data.data;
      // console.log(categories);
      document.getElementById('content').innerHTML = `
          <div id="category-list">
          ${categories
            .map(
              (category) =>
                `
                <ul>
                <li><strong>카테고리 ID: </strong> ${category._id}</li>
                <li><strong>카테고리 이름: </strong> ${category.name}</li>
                </ul>
                <button onclick="editCategory('${category._id}', '${category.name}')"><strong>수정</strong> </button>
                <button onclick="deleteCategory('${category._id}')"><strong>삭제</strong> </button>
`,
            )
            .join('')}
          </div>
          `;
    })
    .catch((error) => {
      console.error('카테고리 관리 페이지를 가져오는 중 오류 발생:', error);
    });
}

window.editCategory = function editCategory(categoryId, categoryName) {
  const newName = prompt('새로운 카테고리 이름을 입력하세요', categoryName);
  // console.log(categoryId, newName);
  if (newName === null || newName.trim() === '') {
    return;
  }

  const updatedData = {
    name: newName,
  };
  // console.log(updatedData.name);
  const jwt = localStorage.getItem('jwt');

  makeFetchRequest(`${URL}/admin/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + jwt,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
    .then(() => {
      // console.log("카테고리 수정 성공");
      fetchCategoriesPage();
    })
    .catch((error) => {
      console.error('카테고리 수정 중 오류 발생:', error);
    });
};

window.deleteCategory = function deleteCategory(categoryId) {
  if (!confirm('정말로 삭제하시겠습니까?')) {
    return;
  }
  const jwt = localStorage.getItem('jwt');

  makeFetchRequest(`${URL}/admin/categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
    },
  })
    .then(() => {
      // console.log("카테고리 삭제 성공");
      fetchCategoriesPage();
    })
    .catch((error) => {
      console.error('카테고리 삭제 중 오류 발생:', error);
    });
};
