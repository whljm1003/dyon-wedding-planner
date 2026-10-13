import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore'

const env = import.meta.env

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

export const LOGIN_EMAIL: string = env.VITE_LOGIN_EMAIL ?? ''

/** 필수 환경변수가 빠졌는지 확인 (빠지면 설정 안내 화면을 보여줌) */
export const missingEnv = [
  ['VITE_FIREBASE_API_KEY', config.apiKey],
  ['VITE_FIREBASE_AUTH_DOMAIN', config.authDomain],
  ['VITE_FIREBASE_PROJECT_ID', config.projectId],
  ['VITE_FIREBASE_APP_ID', config.appId],
  ['VITE_LOGIN_EMAIL', LOGIN_EMAIL],
].filter(([, v]) => !v).map(([k]) => k as string)

const app = missingEnv.length ? null : initializeApp(config)

export const auth = app ? getAuth(app) : null
export const db = app
  ? initializeFirestore(app, {
      ignoreUndefinedProperties: true,
      // 오프라인에서도 마지막 데이터를 보여주고, 다시 연결되면 자동 동기화
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    })
  : null

// 로컬 테스트용: .env.local 에 VITE_USE_EMULATOR=true 를 넣고 Firebase 에뮬레이터로 실행
if (env.VITE_USE_EMULATOR === 'true' && auth && db) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}
