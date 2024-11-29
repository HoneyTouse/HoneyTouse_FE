function checkCookie() {
  try {
    // 쿠키에서 "token"이 있는지 확인
    const tokenCookie = document.cookie.split('; ').find((row) => row.startsWith('token='));

    // "token" 쿠키가 없으면 아무 작업도 하지 않고 종료
    // 구글 소셜로그인을 했을 경우에만 쿠키가 있으므로
    // 일반 로그인 시에는 아무것도 없는게 정상임.
    if (!tokenCookie) return;

    // "token" 쿠키가 있을 경우에만 처리
    const token = tokenCookie.split('=')[1];

    // 로컬 스토리지에 저장
    localStorage.setItem('jwt', token);

    // 쿠키에서 토큰 삭제
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  } catch (error) {
    console.error('Error while handling cookie and token:', error);
  }
}

// 메인 페이지에서 랜딩 시에 실행되도록 호출
checkCookie();
