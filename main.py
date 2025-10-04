# main.py
import uuid #이름표 생성기
from fastapi import FastAPI, Request, Response
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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


@app.get("/")
def greet():
    return {"message": "hello world! go /items"}

@app.post("/api/generate-id") #deviceId 생성해서 유저 주머니에 넣어주기
def generate_device_id(request: Request):
    device_id = request.cookies.get("device_id")
    
    if not device_id:
        device_id = str(uuid.uuid4())
        print("device_id가 없으니까 새로 만든다")

    content = {"device_id": device_id}
    response = JSONResponse(content=content) #JSONResponse사용해서 제대로 변환
    
    response.set_cookie(key="device_id", value=device_id, max_age=31536000, samesite='none', secure=True, httponly=False)
    
    return response

class TapData(BaseModel):
    item: str

@app.post("/log-tap") #deviceId 읽기
def log_tap_endpoint(data: TapData, request: Request):
    device_id = request.cookies.get("device_id")

    if not device_id:
        return {"message": "기기 ID가 없습니다. ..."}
        
    print(f"[서버 기록] ...")
    return {"message": "기록 성공!"}
