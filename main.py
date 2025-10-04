# main.py
import uuid
from fastapi import FastAPI, Request, Response
from fastapi.responses import RedirectResponse # 리다이렉트 기능 가져오기
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- CORS 설정 ---
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 여기가 새로운 핵심! NFC 태그를 찍으면 가장 먼저 도착하는 곳 ---
@app.get("/tap")
def handle_nfc_tap(item: str, request: Request):
    # 1. 요청에 쿠키가 있는지 확인
    device_id = request.cookies.get("device_id")

    # 2. 쿠키가 없다면 새로 생성
    if not device_id:
        device_id = str(uuid.uuid4())

    # 3. 데이터 기록 (원래 log-tap 엔드포인트가 하던 일)
    print(f"[서버 기록 /tap] 기기 ID: {device_id} / 아이템 ID: {item}")
    
    # 4. 이제 프론트엔드 페이지로 사용자를 보낼 준비
    # 최종 목적지인 깃허브 페이지 주소
    redirect_url = f"https://somofth.github.io/nfc-connect/?item={item}&deviceId_from_server={device_id}"
    response = RedirectResponse(url=redirect_url)

    # 5. 떠나는 사용자에게 쿠키를 찍어줌
    response.set_cookie(
        key="device_id", 
        value=device_id, 
        max_age=31536000, 
        samesite='none', 
        secure=True, 
        httponly=False
    )
    
    return response