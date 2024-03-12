import imgLogo from '../img/logo.png';
import imgSearchBanner from '../img/search_banner.jpg';

export const headerHTML = /*html*/`
<div class="h_wrap">
    <div class="h_top_nav">
        <ul>
            <li>
                <a href="">
                    고객센터
                </a>
            </li>
            <li>
                <a href="/login/" class="h_mypage_text">
                    마이페이지
                </a>
            </li>
            <li>
                <a href="">
                    관심
                </a>
            </li>
            <li>
                <a href="">
                    알림
                </a>
            </li>
            <li class="h_login-out on">
                <a href="">
                    로그아웃
                </a>
            </li>
            <li class="h_login">
                <a href="/login/">
                    로그인
                </a>
            </li>
            
        </ul>
    </div>
    <div class="h_logo">
        <h1>
            <a href="/index.html">
                <img class="hl_logo" src="${imgLogo}" alt="" />
                <img class="hl_bee" style="display: block;-webkit-user-select: none;margin: auto;" src="https://em-content.zobj.net/source/animated-noto-color-emoji/356/honeybee_1f41d.gif">
            </a>
        </h1>
    </div>
    <div class="h_nav">
        <ul>
            <li>
                <a href="" class="h_search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </a>
            </li>
            <li>
                <a href="/login/" class="h_mypage-btn">
                    <i class="fa-solid fa-user"></i>
                </a>
            </li>
            <li>
                <a href="/basket/">
                    <i class="fa-solid fa-bag-shopping"></i>
                </a>
            </li>

        </ul>
    </div>
    <div class="h_menu">
        <ul>
            <li class="hm_category">
                <div class="hm_bar">
                    <i class="fa-solid fa-bars"></i>
                </div>
                <p class="hm_category-p">카테고리</p>
                <div class="h_category-list">
                    <ul>
                        <li>
                        <a href="/pdt-category/?category=가구">가구</a>
                        </li>
                        <li>
                            <a href="/pdt-category/?category=패브릭">패브릭</a>
                        </li>
                        <li>
                            <a href="/pdt-category/?category=수납/정리">수납/정리</a>
                        </li>
                        <li>
                            <a href="/pdt-category/?category=생활용품">생활용품</a>
                        </li>
                        <li>
                            <a href="/pdt-category/?category=조명">조명</a>
                        </li>
                        <li>
                            <a href="/pdt-category/?category=인테리어 소품">인테리어 소품</a>
                        </li>
                    </ul>

                </div>
            </li>
        </ul>
    </div>
</div>

<section class="search">
    <button class="search_close">
        <i class="fa-solid fa-xmark"></i>
    </button>
    <div class="search_inner">
        
        <form action="/index.html" class="search_form">
            <input type="text" class="search_text">
            <button><i class="fa-solid fa-magnifying-glass"></i></button>
        </form>

        <div class="search_recent">
            <div>
                <h3>최근 검색어</h3>
                <button class="search_recent_reset">지우기</button>
            </div>
            
            <ul>
               
            </ul>
            <div class="search_banner">
                <img src="${imgSearchBanner}" alt="" />
            </div>
        </div>
    </div>
</section>
`