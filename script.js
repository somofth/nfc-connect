// script.js (단순화된 버전)

let nfc_result = document.querySelector("#nfc_result");

window.onload = () => {
  console.log("페이지 로딩 완료!");
  const urlParams = new URLSearchParams(window.location.search);

  // 서버가 리다이렉트하면서 URL에 직접 넣어준 정보들을 읽기
  const itemId = urlParams.get("item");
  const deviceId = urlParams.get("deviceId_from_server");

  if (itemId && deviceId) {
    nfc_result.innerHTML = `[서버 인증 완료] ${deviceId} 기기에서 ${itemId} 태그 접촉이 확인되었습니다.`;
  } else if (itemId) {
    nfc_result.innerHTML =
      "태그 정보는 있으나, 기기 ID를 서버에서 받지 못했습니다.";
  } else {
    nfc_result.innerHTML = "NFC 태그를 통해 접속해주세요.";
  }
};
