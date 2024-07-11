import Swal from 'sweetalert2'
import { URL } from '/assets/js/constants'
//유효성 체크
const $joinName = document.querySelector('.join_name');
$joinName.addEventListener('input', function () {
    if (validateName(this.value)) {
        $joinName.closest('.name-wrap').classList.remove('invalid');
        $joinName.closest('.name-wrap').classList.add('valid');
    } else {
        $joinName.closest('.name-wrap').classList.remove('valid');
        $joinName.closest('.name-wrap').classList.add('invalid');
    }
});

const $joinPhone = document.querySelector('.join_phone');
$joinPhone.addEventListener('input', function () {
    if (validatePhoneNumber(this.value)) {
        $joinPhone.closest('.phone-wrap').classList.remove('invalid');
        $joinPhone.closest('.phone-wrap').classList.add('valid');
    } else {
        $joinPhone.closest('.phone-wrap').classList.remove('valid');
        $joinPhone.closest('.phone-wrap').classList.add('invalid');
    }
});

const $joinEmail01 = document.querySelector('.join_email-01');
$joinEmail01.addEventListener('input', function () {
    if (validateEmail(this.value)) {
        $joinEmail01.closest('.email-wrap-01').classList.remove('invalid');
        $joinEmail01.closest('.email-wrap-01').classList.add('valid');
    } else {
        $joinEmail01.closest('.email-wrap-01').classList.remove('valid');
        $joinEmail01.closest('.email-wrap-01').classList.add('invalid');
    }
});

const $joinPassword01 = document.querySelector('.join_password-01');
$joinPassword01.addEventListener('input', function () {
    if (validatePassword(this.value)) {
        $joinPassword01.closest('.password-wrap').classList.remove('invalid');
        $joinPassword01.closest('.password-wrap').classList.add('valid');
    } else {
        $joinPassword01.closest('.password-wrap').classList.remove('valid');
        $joinPassword01.closest('.password-wrap').classList.add('invalid');
    }
});

const $joinPassword02 = document.querySelector('.join_password-02');
$joinPassword02.addEventListener('input', function () {
    if (this.value === $joinPassword01.value) {
        $joinPassword02.closest('.password-wrap-2').classList.remove('invalid');
        $joinPassword02.closest('.password-wrap-2').classList.add('valid');
    } else {
        $joinPassword02.closest('.password-wrap-2').classList.remove('valid');
        $joinPassword02.closest('.password-wrap-2').classList.add('invalid');
    }
});


function validateName(name) {
    // 한글, 알파벳 대소문자만 허용하는 정규식
    const re = /^[가-힣A-Za-z]+$/;
    // 정규식 테스트 결과를 반환
    return re.test(name);
}

function validatePhoneNumber(phoneNumber) {
    // 휴대폰 번호 형식을 검증하는 정규식
    const re = /^010\d{8}$/;

    // 정규식 테스트 결과를 반환
    return re.test(phoneNumber);
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    // 정규식: 8~16자의 영문 대소문자, 숫자, 특수문자가 1개 이상 조합
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,16}$/;
    return regex.test(password);
}

//이메일 인증메일 보내기
let sendEamil;
function sendConfirmEmail(evt) {
    const email = evt.target.previousElementSibling.value;
    sendEamil = email;
    if (!email) {
        Swal.fire({
            title: "이메일을 입력하세요.",
            icon: "warning",
            text: `이메일 형식만 가능합니다.`,
            customClass: {
                container: 'custom-popup'
            }
        });
        return
    }

    const data = { email };
    fetch(`${URL}/auth/send-confirmation-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response => response.json())
        .then(data => {
            // 서버에서 성공적으로 응답을 받았을 때 실행되는 코드
            Swal.fire({
                title: "인증 메일을 보냈습니다.",
                text: `이메일을 확인해주세요.`,
                icon: "success",
                customClass: {
                    container: 'custom-popup'
                }
            });
        })
        .catch(error => console.error('Error:', error));
}

const $joinSendEmail = document.querySelector('.join_send-email');
$joinSendEmail.addEventListener("click", (e) => {
    e.preventDefault();
    sendConfirmEmail(e);
})

//이메일 인증완료 버튼
let isconfirmEmail = false;
function confirmEmail(evt) {
    const email = sendEamil;
    const inputNumber = evt.target.previousElementSibling.value;

    if (!email || !inputNumber) {
        Swal.fire({
            title: "인증번호를 확인하세요",
            icon: "warning",
            text: `이메일인증을 진행하지 않았거나 인증번호가 없습니다.`,
            customClass: {
                container: 'custom-popup'
            }
        });
        return;
    }

    const data = { email, inputNumber };
    fetch(`${URL}/auth/confirm-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            const $emailWrap02 = document.querySelector('.email-wrap-02');
            if (data.data == '이메일이 성공적으로 인증되었습니다.') {
                isconfirmEmail = true;
                $emailWrap02.classList.remove('invalid');
                $emailWrap02.classList.add('valid');
                $emailWrap02.querySelector('input').readOnly = true;
                $joinEmail01.readOnly = true;
                Swal.fire({
                    title: "인증번호가 확인되었습니다",
                    icon: "success",
                    text: `회원가입을 계속 진행해주세요.`,
                    customClass: {
                        container: 'custom-popup'
                    }
                });
            } else {
                $emailWrap02.classList.remove('valid');
                $emailWrap02.classList.add('invalid');
                isconfirmEmail = false;
                Swal.fire({
                    title: "인증번호를 확인하세요",
                    icon: "error",
                    text: `인증번호가 틀렸습니다.`,
                    customClass: {
                        container: 'custom-popup'
                    }
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const $joinConfirmEmailBtn = document.querySelector('.join_confirm-email');
$joinConfirmEmailBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(e);
    confirmEmail(e);
})

//서밋이벤트
function registerJoin(evt) {
    evt.preventDefault(); /* POST 이벤트 중지 */
    const name = evt.target.name.value;
    const phoneNumber = evt.target.phoneNumber.value;
    const email = evt.target.email.value;
    const address = evt.target.address.value;
    const addressDetail = evt.target.addressDetail.value;
    const password = evt.target.password.value;

    if (!name || !phoneNumber || !email || !address || !addressDetail || !password) {
        Swal.fire({
            title: "필수값을 입력해주세요.",
            text: `이름, 번호, 이메일, 주소, 비밀번호 모두 입력하세요`,
            icon: "warning",
            customClass: {
                container: 'custom-popup'
            }
        });
        return ;
    }

    if (!isconfirmEmail) {
        Swal.fire({
            title: "이메일 인증은 필수입니다.",
            text: `이메일 인증번호를 확인해주세요`,
            icon: "warning",
            customClass: {
                container: 'custom-popup'
            }
        });
        return;
    }

    const data = { name, phoneNumber, email, password, address, addressDetail };
    fetch(`${URL}/auth/sign-up`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // 요청이 성공하면 다른 페이지로 이동
        Swal.fire({
            title: "회원가입을 축하합니다!",
            text: `환영합니다`,
            icon: "success",
            customClass: {
                container: 'custom-popup'
            }
        }).then((result)=> {
            window.location.href = '/login/index.html';
        });
    })
        .catch(error => console.error('Error:', error));
}

document.querySelector('form').addEventListener('submit', registerJoin);