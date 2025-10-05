// script.js
const button = document.querySelector("button");
let result = document.querySelector("#result");
let nfc_result = document.querySelector("#nfc_result");
const backendUrl = "https://api.almang.shop";
async function getOrSetDeviceID() {
  console.log("서버에 deviceID 확인 및 발급을 요청합니다...");
  try {
    // 그냥 무조건 서버에 요청을 보내! 쿠키가 있든 없든 서버가 알아서 판단할 거야.
    const response = await fetch(`${backendUrl}/api/generate-id`, {
      method: "POST",
      credentials: "include", // 쿠키가 있다면 브라우저가 알아서 보내줌
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await response.json();
    const deviceId = data.device_id;
    console.log("서버로부터 최종 deviceID를 받음:", deviceId);
    return deviceId;
  } catch (error) {
    console.error("ID 발급/확인 중 에러:", error);
    return null;
  }
}

button.addEventListener("click", async () => {
  result.innerHTML = "ID 확인 중...";
  const deviceId = await getOrSetDeviceID();
  result.innerHTML = `현재 기기 ID: ${deviceId}`;
});

// NFC 읽기 (수정됨)
window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("item");

  // 비동기 함수이므로 await로 기다려야 함
  const deviceId = await getOrSetDeviceID();

  if (itemId && deviceId) {
    try {
      const response = await fetch(`${backendUrl}/api/log-tap`, {
        method: "POST",
        credentials: "include", // 쿠키를 담아서 보내라
        headers: { "Content-Type": "application/json" },
        // 이제 body에는 item 정보만 보냄
        body: JSON.stringify({ item: itemId }),
      });

      if (response.ok) {
        nfc_result.innerHTML = `${deviceId} 기기에서 ${itemId} 태그 접촉 기록 성공!`;
      } else {
        nfc_result.innerHTML = `기록 실패 (오류코드: ${response.status})`;
      }
    } catch (error) {
      console.error("Fetch 에러:", error);
      nfc_result.innerHTML = "기록 실패 (네트워크 오류)";
    }
  } else {
    nfc_result.innerHTML = "태그 또는 기기 정보가 올바르지 않습니다.";
  }
};
