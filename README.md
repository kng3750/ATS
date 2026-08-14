# ATS — CareerAI Pro

참여자 적합성 분석과 맞춤형 취업 지원 서류 생성을 위한 정적 웹 프론트엔드 및 Gemini 서버리스 API입니다.

## 보안 구조

Gemini API 키는 `GEMINI_API_KEY` 서버 환경변수로만 읽습니다. 키는 HTML, 브라우저 JavaScript, 정적 파일, Git 저장소에 포함되지 않으며, `/api/generate` 서버리스 함수가 Gemini API를 호출합니다.

기존에 노출된 키는 재사용하지 말고 발급처에서 폐기한 뒤 새 키를 발급하세요. 실제 키는 채팅, 소스 코드, README, `.env.example`에 입력하지 않습니다.

## 로컬 실행

Node.js 18 이상을 사용합니다. 먼저 의존성을 설치합니다.

```bash
npm install
```

Windows PowerShell에서는 현재 터미널 세션에만 키를 설정한 뒤 서버를 실행할 수 있습니다.

```powershell
$env:GEMINI_API_KEY="새로 발급한 키"
npm start
```

브라우저에서 `http://localhost:3001`을 열고 `/api/health` 응답의 `hasEnvKey`가 `true`인지 확인합니다. API 키 원문은 응답에 포함되지 않습니다.

## Vercel 배포

GitHub 저장소를 Vercel 프로젝트에 연결한 후 Vercel 프로젝트 설정의 Environment Variables에서 다음 변수를 필요한 환경에 등록합니다.

| 이름 | 값 | 적용 환경 |
|---|---|---|
| `GEMINI_API_KEY` | 새로 발급한 Gemini API 키 | Preview, Production 및 필요한 Development |
| `ALLOWED_ORIGIN` | 선택 사항: 실제 배포 도메인 | Production |

`GEMINI_API_KEY`는 반드시 서버 환경변수로 등록하고 `NEXT_PUBLIC_` 또는 `VITE_` 접두사를 사용하지 않습니다. 등록 후 새 배포를 실행해야 변경된 환경변수가 배포에 반영됩니다.

## 배포 전 보안 검사

```bash
git status --short
grep -RInE --exclude-dir=node_modules --exclude-dir=.git 'GEMINI_ENV_KEY|AIza|gemini_key|gemini\.env' .
```

검사 결과에 실제 키나 키 파일이 나타나면 커밋하지 않습니다. `node_modules`, `.env`, `env/*.env`, `env/*key*`는 `.gitignore`로 제외됩니다.

## API

`GET /api/health`는 서버 환경변수에 키가 설정되어 있는지만 Boolean으로 반환합니다. `POST /api/generate`는 `{ "prompt": "..." }` 형식으로 요청하며, 응답은 생성된 `text`와 사용 모델 `modelUsed`를 반환합니다. 오류 응답에는 API 인증 쿼리나 키 원문을 포함하지 않습니다.
