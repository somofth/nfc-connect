// script.js
const button = document.querySelector("button");
let result = document.querySelector("#result");
let nfc_result = document.querySelector("#nfc_result");
const backendUrl = "https://targetless-ciara-gripiest.ngrok-free.dev"; // ngrok 주소를 변수로 관리하면 편해

// 쿠키에서 특정 이름의 값을 가져오는 도우미 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// 서버와 통신하여 deviceID를 가져오거나 생성하는 비동기 함수
async function getOrSetDeviceID() {
  // 1. 먼저 브라우저에 쿠키가 있는지 확인
  let deviceId = getCookie("device_id");

  // 2. 쿠키가 있다면 바로 반환
  if (deviceId) {
    console.log("Cookie에서 deviceID 찾음:", deviceId);
    return deviceId;
  }

  // 3. 쿠키가 없다면 서버에 ID 발급 요청
  console.log("쿠키 없음, 서버에 ID 발급 요청...");
  try {
    const response = await fetch(`${backendUrl}/api/generate-id`, {
      method: "POST",
      credentials: "include", // 쿠키를 담아서 보내라
    });
    const data = await response.json();
    deviceId = data.device_id;
    console.log("서버로부터 새 deviceID 발급받음:", deviceId);
    return deviceId;
  } catch (error) {
    console.error("ID 발급 중 에러:", error);
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
        nfc_result.innerHTML = `기록 실패 (서버 오류: ${response.status})`;
      }
    } catch (error) {
      console.error("Fetch 에러:", error);
      nfc_result.innerHTML = "기록 실패 (네트워크 오류)";
    }
  } else {
    nfc_result.innerHTML = "태그 또는 기기 정보가 올바르지 않습니다.";
  }
};
