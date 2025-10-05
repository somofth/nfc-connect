// script.js (Vercel 프록시 최종 버전)

// HTML 요소들을 미리 찾아둠
const button = document.querySelector("button");
const result = document.querySelector("#result");
const nfc_result = document.querySelector("#nfc_result");

// backendUrl 변수는 이제 Vercel 프록시를 사용하므로 필요 없음!

/**
 * 서버에 deviceID를 확인하고, 없으면 발급을 요청하는 함수.
 * 이제 모든 요청은 같은 도메인('/api/...')으로 보내므로 아주 안정적임.
 */
async function getOrSetDeviceID() {
  console.log("서버에 deviceID 확인 및 발급을 요청합니다...");
  try {
    // Vercel 프록시를 통해 백엔드로 전달될 상대 경로
    const response = await fetch("/api/generate-id", {
      method: "POST",
      credentials: "include", // 쿠키를 주고받기 위한 필수 옵션
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    const deviceId = data.device_id;
    console.log("서버로부터 최종 deviceID를 받음:", deviceId);
    return deviceId;
  } catch (error) {
    console.error("ID 발급/확인 중 에러:", error);
    nfc_result.innerHTML = "오류: 서버에서 기기 ID를 받아올 수 없습니다.";
    return null;
  }
}

// 페이지가 완전히 로드된 후 실행
window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("item");

  // 비동기 함수이므로 await로 기다려야 함
  const deviceId = await getOrSetDeviceID();

  // URL에 아이템 ID가 있고, 서버로부터 기기 ID도 성공적으로 받았을 때
  if (itemId && deviceId) {
    try {
      // Vercel 프록시를 통해 백엔드로 전달될 상대 경로
      const response = await fetch(`/api/log-tap`, {
        method: "POST",
        credentials: "include", // 쿠키를 보내기 위한 필수 옵션
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: itemId }),
      });

      if (response.ok) {
        nfc_result.innerHTML = `[인증 완료] ${deviceId} 기기에서 ${itemId} 태그 접촉 기록 성공!`;
      } else {
        nfc_result.innerHTML = `기록 실패 (서버 오류: ${response.status})`;
      }
    } catch (error) {
      console.error("Fetch 에러:", error);
      nfc_result.innerHTML = "기록 실패 (네트워크 오류)";
    }
  }
  // URL에 아이템 ID가 없을 경우 (NFC 태그로 접속한 게 아닐 경우)
  else if (!itemId) {
    nfc_result.innerHTML = "NFC 태그를 통해 접속해주세요.";
  }
  // 그 외의 경우 (deviceId를 못 받아온 경우)
  else {
    // getOrSetDeviceID 함수 내부에서 이미 오류 메시지를 표시했으므로, 여기선 추가 동작 없음
  }
};

// 이 버튼 부분은 디버깅용이므로 그대로 두거나 삭제해도 괜찮아.
button.addEventListener("click", async () => {
  result.innerHTML = "ID 확인 중...";
  const deviceId = await getOrSetDeviceID();
  result.innerHTML = `현재 기기 ID: ${deviceId}`;
});
