import Swal from 'sweetalert2'
import { URL } from '/assets/js/constants'

// 메인01 슬라이드 스와이퍼
let swiper = new Swiper(".main-slide__container", {
    speed: 800,
    loop: true,
    effect: "fade",
    pagination: {
        el: ".main-slide__pagination",
        dynamicBullets: true,
    },
    autoplay: {
        delay: 2000,
    },
});

//베스트픽 목록
const $main02ProductList = document.querySelector('.main02_product-list')
let bestPickLi;
fetch(`${URL}/products`, {
    method: 'GET',
}).then(response => response.json())
    .then(data => {
        bestPickLi = data.data;
        for (let i = bestPickLi.length - 1; bestPickLi.length - 9 < i; i--) {
            if (bestPickLi[i]) {
                $main02ProductList.innerHTML += createProductLi(bestPickLi[i]);
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });


function createProductLi(data) {
    let categor;
    let calssname;
    if (data.categoryId == "65d996b13c5450608d6d9610") {
        categor = "조명";
        calssname = "tag-01";
    } else if (data.categoryId == "65db29c08d8cdb722c0cb502") {
        categor = "패브릭"
        calssname = "tag-02";
    } else if (data.categoryId == "65db5503ea99b307c47bd1d8") {
        categor = "생활용품"
        calssname = "tag-03";
    } else if (data.categoryId == "65dd65d428bdd95418e9a1cd") {
        categor = "수납/정리"
        calssname = "tag-04";
    } else if (data.categoryId == "65dd65f728bdd95418e9a1cf") {
        categor = "가구"
        calssname = "tag-05";
    } else if (data.categoryId == "65dd660d28bdd95418e9a1d1") {
        categor = "인테리어소품"
        calssname = "tag-06";
    }
    return (/*html*/
        `
            <li id="${data._id}">
                <i class="fa-solid fa-bag-shopping pl_basketBtn" onclick="clickBasketBtn(this)"></i>
                <a href="/pdt-info/?id=${data._id}" class="pl_img">
                    <img src="${data.image}" alt="${data.name}">
                </a>
                <a href="" class="pl_title">
                    ${data.name}
                </a>

                <p class="pl_price">
                    ${data.price.toLocaleString('ko-KR')}원
                </p>

                <p class="pl_tag">
                    <span>#${data.brand}</span>
                    <span class="${calssname}">#${categor}</span>
                </p>

            </li>
            `
    )
}

//엠디픽
const $mdProductList = document.querySelector('.md_product-list');
let mdPickLi;
fetch(`${URL}/products?categoryId=65d996b13c5450608d6d9610`, {
    method: 'GET',
}).then(response => response.json())
    .then(data => {
        mdPickLi = data.data;
        for (let i = mdPickLi.length - 1; mdPickLi.length - 7 < i; i--) {
            if (mdPickLi[i]) {
                $mdProductList.innerHTML += createProductLi(mdPickLi[i]);
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });


const $mdTagList = document.querySelectorAll('.md_pick>ul>li');
$mdTagList.forEach((el) => {
    const $targetBtn = el.querySelector('a');
    $targetBtn.addEventListener("click", (e) => {
        e.preventDefault();
        clickMdTag($targetBtn.dataset.url);
        e.target.closest('li').classList.add('on');
    })
})

function clickMdTag(url) {
    let dataArr;
    $mdProductList.innerHTML = '';
    $mdTagList.forEach((el) => {
        el.querySelector('a').closest('li').classList.remove('on');
    })
    fetch(`${URL}/products?categoryId=${url}`, {
        method: 'GET',
    }).then(response => response.json())
        .then(data => {
            dataArr = data.data;
            for (let i = dataArr.length - 1; dataArr.length - 7 < i; i--) {
                if (dataArr[i]) {
                    $mdProductList.innerHTML += createProductLi(dataArr[i]);
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function clickBasketBtn(e) {
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
            console.log(basketItemList);
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

window.clickBasketBtn = clickBasketBtn;