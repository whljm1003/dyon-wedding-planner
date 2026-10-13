# Wedding planner

두 사람이 함께 쓰는 2027 야외 웨딩·신혼집 준비 플래너입니다.
React + Vite, Firebase(Firestore·Authentication), GitHub Pages(GitHub Actions)로 동작합니다.

## 구조

```
src/
  App.tsx              # 로그인 여부에 따라 비밀번호 화면 / 플래너
  Planner.tsx          # 사이드바·헤더·뷰 전환·백업·모달
  components/          # PasswordGate, TaskItem, MonthCard, Modal, 입력 필드
  views/               # Overview, Monthly, Wedding, Honeymoon, Home, Vendors
  lib/
    defaults.ts        # 기본 데이터(할 일·예산·계약 항목 등)
    firebase.ts        # Firebase 초기화 (환경변수 사용)
    usePlanner.ts      # Firestore 실시간 구독 + 자동 저장
    migrate.ts         # 저장 데이터·백업 파일 보정
```

- 데이터는 Firestore `planner/main` 문서 하나에 저장되고, 두 사람의 기기에 실시간 반영됩니다.
- 비밀번호 화면은 내부적으로 **공용 계정 1개**(이메일은 환경변수로 숨김)에 로그인합니다.
  Firestore 보안 규칙이 그 계정만 데이터에 접근하도록 막습니다.

## 1. Firebase 설정 (최초 1회)

1. <https://console.firebase.google.com> → **프로젝트 추가** (Google 애널리틱스는 꺼도 됩니다)
2. **Authentication** → 시작하기 → 로그인 방법에서 **이메일/비밀번호** 사용 설정
3. Authentication → **사용자** → 사용자 추가
   - 이메일: 공용 계정용 이메일 (실제 메일함이 없어도 됨, 예: `us@wedding-planner.app`)
   - 비밀번호: 두 사람이 입력할 비밀번호 (8자 이상 권장)
4. Authentication → 설정 → **승인된 도메인**에 `<GitHub 아이디>.github.io` 추가
5. **Firestore Database** → 데이터베이스 만들기 → 위치 `asia-northeast3 (서울)` → 프로덕션 모드
6. Firestore → **규칙** 탭에 `firestore.rules` 내용을 붙여넣고, `REPLACE_WITH_LOGIN_EMAIL`을 3번 이메일로 바꾼 뒤 게시
7. 프로젝트 설정(⚙) → 일반 → 내 앱 → **웹 앱 추가(</>)** → 표시되는 `firebaseConfig` 값 확인

## 2. 로컬 실행

```bash
cp .env.example .env.local   # 값 채우기
npm install
npm run dev
```

## 3. GitHub Pages 배포

1. 저장소 **Settings → Secrets and variables → Actions → New repository secret**에 아래 5개 등록

   | 이름 | 값 |
   | --- | --- |
   | `VITE_FIREBASE_API_KEY` | firebaseConfig.apiKey |
   | `VITE_FIREBASE_AUTH_DOMAIN` | firebaseConfig.authDomain |
   | `VITE_FIREBASE_PROJECT_ID` | firebaseConfig.projectId |
   | `VITE_FIREBASE_APP_ID` | firebaseConfig.appId |
   | `VITE_LOGIN_EMAIL` | 공용 계정 이메일 |

2. **Settings → Pages → Build and deployment → Source: GitHub Actions**
3. `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 빌드·배포합니다.
   (Secrets를 나중에 등록했다면 Actions 탭에서 워크플로를 **Re-run** 하세요.)
4. 주소: `https://<GitHub 아이디>.github.io/wedding-planner/`

> Firebase 웹 설정값(apiKey 등)은 원래 브라우저에 노출되는 값이라 비밀이 아닙니다.
> 실제 보호는 **비밀번호 + Firestore 보안 규칙**이 담당합니다.

## 비밀번호 변경

Firebase 콘솔 → Authentication → 사용자에서 공용 계정을 삭제하고, **같은 이메일**로 새 비밀번호를 넣어 다시 만드세요.
보안 규칙은 이메일 기준이라 데이터는 그대로 유지됩니다. 기존 기기는 '잠그기' 후 새 비밀번호로 다시 입장하면 됩니다.

## 도메인 연결 (나중에)

커스텀 도메인을 쓰면 `vite.config.ts`의 base를 `'/'`로 바꾸고(또는 워크플로의 `VITE_BASE: /`),
Firebase 승인된 도메인에 새 도메인을 추가하세요.
