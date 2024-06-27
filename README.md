# 🐝꿀단집 FrontEnd Repository

> **"당신의 감성을 흔드는 인테리어 꿀템이 가득한 꿀단집"**

> "특별한 감성을 담은 소품과 가구를 원하는 당신을 위한 꿀템이 가득!<br>
> 저희 꿀단집에서 만나보세요.” 🍯🏠

> 📌 <b>HoneyTouse URL</b> : http://honeytouseclient.s3-website.ap-northeast-2.amazonaws.com/<br>
> 📌 <b>HoneyTouse ReadMe</b> : https://github.com/HoneyTouse<br>
> 📌 <b>HoneyTouse FrontEnd Github</b> : https://github.com/HoneyTouse/HoneyTouse_FE

![리드미최상단](https://github.com/HoneyTouse/HoneyTouse_BE/assets/127278410/6374c883-fad2-40ad-bec2-01fcf71cac01)

---

## 바로가기

- [프로젝트 개요](#프로젝트-개요)<br>
- [프로젝트 아키텍쳐](#프로젝트-아키텍쳐)<br>
- [이슈 해결](#이슈-해결)<br>

---

## 프로젝트 개요

- ### 기간 및 방식 <br>

  - <b>1차</b> : 기획 및 개발 (24.02.19 ~ 24.03.01) <i>[2주]</i><br>

  - <b>2차</b> : 리팩토링 (24.03.08 ~ ) <i>[자율]</i><br>

- ### 인원 및 역할 <br>

  - 프론트엔드 4명<br>
  - 1명 추가 참여

  | 이름   | 역할                                                |
  | ------ | --------------------------------------------------- |
  | 김지윤 | • 상품 상세 페이지<br> • 장바구니 페이지            |
  | 신창건 | • 마이페이지 프로필 관리                            |
  | 이승철 | • 메인 페이지<br> • 로그인 및 회원가입 페이지       |
  | 이보미 | • 주문 및 결제 페이지<br>• 마이페이지 주문내역 부분 |
  | 최정민 | • 관리자 페이지                 

- ### 기술스택 <br>

  - <b>프론트엔드</b> : HTML, CSS, JavaScript
  - <b>라이브러리</b> : Swiper.js, SweetAlert2, Vite

---

## 프로젝트 구조

![꿀단집프론트엔드아키텍쳐](https://github.com/TripTeller-repository/TripTeller_BE/assets/127278410/886477e0-208e-4846-9f00-7a36aa6c020b)

---

## 이슈 해결

### [공통]
- <b>문제</b><br>
    - fetch() 함수로 서버와 소통했을 때 에러 발생<br> (header, body 입력값 형식 불일치)

- <b>해결 과정</b>
    1) 개발자 도구→ 네트워크 부분에 찍히는 오류형태 체크하기
    2) 백엔드API 문서를 확인해 요청URL이 맞나 체크하기
    3) 포스트맨으로 테스트하기 (url,과 req.body부분, 서버 정상작동하는지) + 백엔드팀과 소통
    4) 다시 프론트에서 통신에 성공한 객체 데이터 형식으로 데이터를 보내고 있는지 체크 (변수명과 타입 등)
    5) 수정한 객체정보와 fetch() 헤더 정보를 올바르게 넣었나 체크하고 요청
    6) 서버에서 정상적인 응답받는지 확인
<details>
<summary>관련 내용 <i>(사진 첨부)</i></summary>
<div markdown="1">

디스코드 소통 과정

1. 이슈공유
    
    ![image](https://github.com/TripTeller-repository/TripTeller_BE/assets/127278410/806bb0fa-2e98-4333-91bf-4dc111e1f2e5)
    
2. 프론트에서 코드값 체크해보기
    
    ![image](https://github.com/TripTeller-repository/TripTeller_BE/assets/127278410/75ccc673-c255-48e6-b006-927a11e42b26)
    
3. 백엔드에서 API 체크하고 성공하는 테스트 요청 예시값 보여주기
    
    ![image](https://github.com/TripTeller-repository/TripTeller_BE/assets/127278410/7f4ef013-2e23-472d-92a0-62926d863e98)
    
4. 프론트에서 테스트 진행
    
    ![image](https://github.com/TripTeller-repository/TripTeller_BE/assets/127278410/3c8642ae-c082-4bf9-997f-a639c24cb148)
    
    ![image](https://github.com/TripTeller-repository/TripTeller_BE/assets/127278410/1fa75ad4-8ad2-42d9-93b3-31d628f36673)
    
5. 서버에서 응답받은값 체크
![image](https://github.com/TripTeller-repository/TripTeller_BE/assets/127278410/92806b4e-e21b-4cb5-9dc4-acf93ff8c44c)


</div>
</details>
<br>

### [보미]

- <b>문제 1</b> : 로컬환경에서는 문제 없었으나, 빌드 후 페이지에 script 파일이 연동되지 않음.
- <b>원인</b> : type=module 속성이 없으면 JS파일이 연동되지 않음.
- <b>해결과정</b> : 페이지별 스크립트 태그 안에 type=module 속성값 추가하여 해결함.
<details>
<summary>관련 내용 <i>(사진 첨부)</i></summary>
<div markdown="1">
수정 전

![보미1-1](https://github.com/TripTeller-repository/TripTeller_BE/assets/127278410/ed6247d4-3995-47da-9d8e-923bf758d5d8)

수정 후
![보미1-2](https://github.com/TripTeller-repository/TripTeller_BE/assets/127278410/b3e8fec3-cfbf-43c9-8d92-6ad7e9c3ab9c)

</div>
</details>
<br>

- <b>문제 2</b> : 프론트에서 서버로 데이터 POST 요청 시 에러 발생 (1)
- <b>원인</b> : 해당 스키마 안에 배열 형태가 있었으나, POST 요청으로 보낸 데이터에는 배열형태가 없었음.
- <b>해결과정</b> : 데이터 형식을 변경하여 해결함.

<br>

- <b>문제 3</b> : 프론트에서 서버로 데이터 POST 요청 시 에러 발생 (2)
- <b>원인</b> : 서버 API가 jwt 토큰이 있어야 POST 요청이 가능하도록 설정되어 있었음.
- <b>해결과정</b> : fecth - headers에 jwt 토큰 코드를 추가하여 해결함.
<details>
<summary>관련 내용 <i>(사진 첨부)</i></summary>
<div markdown="1">

![보미3](https://github.com/TripTeller-repository/TripTeller_BE/assets/127278410/7e43eda1-38cb-4f8c-94b3-232380a86dc1)

</div>
</details>
<br>

- <b>문제 4</b> : fetch 함수로 html 코드를 생성 후 적용되어야 하는 함수가 실행되지 않음.
- <b>원인</b> : fetch 코드 바깥에 함수코드가 있어, html 코드 생성 전에 함수가 먼저 실행되었기 때문임.
- <b>해결과정</b> : fetch - then 안에 함수를 넣어 비동기처리하여 해결함.
<br>


### [승철]

- <b>문제 1</b> : script type=module 명시시 html에 스크립트 바로 바인딩하면 함수를 불러올 수 없음.
- <b>해결과정</b> : 
    - window객체에 올려 전역으로 사용하기<br>
    - 동적으로 생성되는 html은 부모태그에 이벤트 바인딩처리하기
<br>
- <b>문제 2</b> : input checkbox 클릭이벤트시 체크값이 반영 전으로 뜸.
- <b>해결과정</b> : 클릭이벤트가 아닌 onChange로 처리하여 오류가 해결됨.

<details>
<summary>관련 내용 <i>(사진 첨부)</i></summary>
<div markdown="1">
1. script type=module 명시시 html에 스크립트 바로 바인딩하면 함수를 불러올수 없음

![승철1](https://github.com/TripTeller-repository/TripTeller_BE/assets/127278410/842e956d-58b8-4a36-877f-46be6aad1567)

<br>

2. input checkbox 클릭이벤트시 체크값이 반영전으로 뜨던 현상<br>

![승철2](https://github.com/TripTeller-repository/TripTeller_BE/assets/127278410/1935f25a-65ae-4d6c-8097-04e53a839ddc)


</div>
</details>