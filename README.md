# 로컬 기기 정보와 NFC 태그 정보를 서버로 전송하기

## NFC Contact Logger 🏷️

NFC 태그와 웹 기술을 활용하여, 특정 사물과 스마트폰의 접촉을 기록하고 서버로 전송하는 간단한 시스템입니다. 이 프로젝트는 별도의 앱 설치 없이 웹 브라우저만으로 NFC 기능을 활용하는 방법을 탐구하기 위해 시작되었습니다.

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)

<br>

## ✨ 주요 기능

* **NFC 태그 연동:** NFC 태그 접촉 시 지정된 웹페이지를 자동으로 실행합니다.
* **로그인 없는 기기 식별:** 브라우저의 `localStorage`와 `crypto.randomUUID()`를 활용하여, 사용자 로그인 없이도 기기를 고유하게 식별합니다.
* **비동기 통신:** `Fetch API`를 사용하여 프론트엔드와 백엔드 간에 비동기적으로 데이터를 전송합니다.
* **간단한 API 서버:** Python의 FastAPI 프레임워크를 사용하여 접촉 기록을 수신하는 간단한 API 서버를 구축합니다.

<br>

## ⚙️ 시스템 아키텍처

이 프로젝트는 다음과 같은 흐름으로 동작합니다.

1.  **NFC 태그:** 각 사물(예: 머리끈)을 식별할 수 있는 고유한 ID가 담긴 URL을 저장하고 있습니다.
    * `예시: https://[내-깃허브-주소]/index.html?item=hairtie`
2.  **스마트폰 & 브라우저 (Frontend):**
    * NFC 태그에 스마트폰을 접촉하면, 저장된 URL을 읽어 웹 브라우저를 실행합니다.
    * 웹페이지의 JavaScript(`script.js`)가 실행됩니다.
    * 스크립트는 URL에서 아이템 ID(`hairtie`)를, `localStorage`에서 기기 ID를 가져옵니다.
    * `Fetch API`를 사용해 이 두 가지 정보를 백엔드 서버로 전송합니다.
3.  **백엔드 서버 (Backend):**
    * FastAPI로 구축된 서버가 `/api/log-tap` 주소에서 데이터를 기다립니다.
    * 프론트엔드로부터 아이템 ID와 기기 ID를 수신하면, 터미널에 해당 내용을 출력하며 기록합니다.
    * 프론트엔드에 처리 성공 메시지를 응답으로 보내줍니다.



<br>

## 🚀 시작하기

이 프로젝트를 로컬 환경에서 실행하는 방법입니다.

### 사전 준비

* [Python 3.8+](https://www.python.org/)
* [Git](https://git-scm.com/)
* [Visual Studio Code](https://code.visualstudio.com/)
* VS Code 확장 프로그램: **Live Server**

---

### 1. 백엔드 서버 실행하기 (FastAPI)

```bash
# 1. 프로젝트를 클론합니다.
git clone [https://github.com/](https://github.com/)[네-깃허브-아이디]/[레포지토리-이름].git
cd [레포지토리-이름]

# 2. Python 가상환경을 생성하고 활성화합니다.
python -m venv .venv
# Windows
.\.venv\Scripts\activate
# macOS / Linux
# source .venv/bin/activate

# 3. 필요한 라이브러리를 설치합니다.
# (만약 requirements.txt가 없다면, 'pip install fastapi "uvicorn[standard]"' 명령어를 실행하세요.)
pip install -r requirements.txt

# 4. FastAPI 개발 서버를 실행합니다.
uvicorn main:app --reload
```
서버가 `http://127.0.0.1:8000` 에서 실행됩니다.

---

### 2. 프론트엔드 실행하기 (Live Server)

1.  VS Code에서 `index.html` 파일을 엽니다.
2.  VS Code 오른쪽 하단의 **"Go Live"** 버튼을 클릭하여 Live Server를 실행합니다.
3.  웹 브라우저에서 `http://127.0.0.1:5500` (또는 다른 포트) 주소로 프론트엔드 페이지가 열립니다.

---

### 3. NFC 태그 준비하기

1.  스마트폰에 'NFC Tools' 같은 NFC 태그 관리 앱을 설치합니다.
2.  URL 기록 기능을 사용하여 아래 형식의 주소를 NFC 태그에 씁니다.
    * **테스트용 URL:** `http://127.0.0.1:5500/index.html?item=[원하는_아이템_ID]`
    * **배포용 URL:** `https://[네-깃허브-주소]/index.html?item=[원하는_아이템_ID]`

<br>

## 📝 향후 개선 과제

* [ ] 데이터베이스 연동 (SQLite, PostgreSQL 등)을 통해 접촉 기록 영구 저장
* [ ] 접촉 기록을 시각적으로 보여주는 대시보드 페이지 구현
* [ ] 백엔드 서버를 클라우드 서비스(예: Vercel, Railway)에 배포
* [ ] 사용자 인증 기능 추가
