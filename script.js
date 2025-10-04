//deviceID

function getOrSetDeviceID() {
  // 1. localStorage에서 deviceID를 찾아본다.
  let deviceId = localStorage.getItem("deviceID");

  // 2. 만약 deviceID가 없다면 (최초 방문자라면)
  if (!deviceId) {
    // 3. 새로운 고유 ID를 생성한다. (요즘 브라우저는 이 기능을 기본 지원!)
    deviceId = crypto.randomUUID();
    // 4. 생성한 ID를 localStorage에 저장한다.
    localStorage.setItem("deviceID", deviceId);
  } else {
    console.log("deviceID exists:", deviceId);
  }

  // 5. 저장되어 있거나 새로 만든 ID를 반환한다.
  return deviceId;
}

console.log("Device ID:", getOrSetDeviceID());

const button = document.querySelector("button");
let result = document.querySelector("#result");
button.addEventListener("click", () => {
  // 버튼 클릭 시 deviceID를 다시 확인해본다.
  result.innerHTML = getOrSetDeviceID();
});

// 웹페이지가 로드되자마자 실행
window.onload = async () => {
  // 1. URL에서 'item' 정보 꺼내기
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get("item"); // 'hairtie'

  if (itemId) {
    // 2. 이 정보를 서버로 보내기
    try {
      // '/api/log-tap'이라는 주소로 데이터 전송
      const response = await fetch("/api/log-tap", {
        method: "POST", // 데이터를 생성/기록할 때는 보통 POST 방식을 사용
        headers: {
          "Content-Type": "application/json",
        },
        // 어떤 아이템이 찍혔는지 JSON 형태로 만들어서 전송
        body: JSON.stringify({ item: itemId }),
      });

      if (response.ok) {
        // 성공적으로 서버에 전송되면
        document.body.innerHTML = `${itemId} 태그 접촉이 성공적으로 기록되었습니다.`;
      } else {
        // 서버에서 에러가 발생하면
        document.body.innerHTML = "기록에 실패했습니다. (서버 오류)";
      }
    } catch (error) {
      // 네트워크 문제 등으로 전송 자체가 실패하면
      document.body.innerHTML = "기록에 실패했습니다. (네트워크 오류)";
    }
  } else {
    document.body.innerHTML = "태그 정보가 올바르지 않습니다.";
  }
};
