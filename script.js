// script.js (단순화된 최종 버전)

// 결과를 표시할 HTML 요소를 가져오는 건 그대로
let nfc_result = document.querySelector("#nfc_result");

// 페이지가 로드되면 바로 실행
window.onload = () => {
  console.log("페이지 로딩 완료! URL에서 서버가 준 정보를 찾습니다...");

  // 현재 페이지의 URL을 분석
  const urlParams = new URLSearchParams(window.location.search);

  // 서버가 리다이렉트하면서 URL에 직접 넣어준 정보들을 꺼냄
  const itemId = urlParams.get("item");
  const deviceId = urlParams.get("deviceId_from_server");

  // 두 정보가 모두 URL에 존재한다면, 성공 메시지를 화면에 표시
  if (itemId && deviceId) {
    nfc_result.innerHTML = `[서버 인증 완료] ${deviceId} 기기에서 ${itemId} 태그 접촉이 확인되었습니다.`;
  }
  // URL에 정보가 없다면, 일반적인 방법으로 접속했다는 의미
  else {
    nfc_result.innerHTML = "NFC 태그를 통해 접속해주세요.";
  }
};

// ID를 가져오는 버튼이나 다른 복잡한 함수들은 이제 필요 없음
// const button = ...
// function getOrSetDeviceID() { ... } 등등 모두 삭제
