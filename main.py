# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware # CORS 미들웨어 가져오기

app = FastAPI()

# === CORS 설정 추가 ===
origins = [
    "*" # 일단 테스트를 위해 모든 주소를 허용
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ======================

class TapData(BaseModel):
    item: str
    device: str

@app.post("/items")
def log_tap_endpoint(data: TapData):
    print(f"접근 감지")
    return {"message": f"[서버 기록] 기기 ID: {data.device} / 아이템 ID: {data.item}"}