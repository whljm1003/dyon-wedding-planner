import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState, type FormEvent } from 'react'
import { auth, LOGIN_EMAIL, missingEnv } from '../lib/firebase'

const ERRORS: Record<string, string> = {
  'auth/invalid-credential': '비밀번호가 맞지 않아요.',
  'auth/wrong-password': '비밀번호가 맞지 않아요.',
  'auth/too-many-requests': '시도가 너무 많아요. 잠시 후 다시 시도하세요.',
  'auth/network-request-failed': '네트워크 연결을 확인하세요.',
  'auth/user-not-found': '공용 계정이 없어요. Firebase Authentication에서 계정을 만들어 주세요.',
  'auth/operation-not-allowed': 'Firebase에서 이메일/비밀번호 로그인을 켜 주세요.',
}

export function PasswordGate() {
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!auth || !pw) return
    setBusy(true)
    setMsg('')
    try {
      await signInWithEmailAndPassword(auth, LOGIN_EMAIL, pw)
    } catch (err: any) {
      setMsg(ERRORS[err?.code] ?? '입장하지 못했어요: ' + (err?.message ?? err))
      setPw('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="gate">
      <div className="gate-card">
        <div className="eyebrow">OUR DAY · PRIVATE PLANNER</div>
        <h1>Wedding planner</h1>
        <p>두 사람만 사용하는 2027 야외 웨딩·신혼집 준비 공간입니다.</p>
        {missingEnv.length ? (
          <p className="error tiny">
            Firebase 설정값이 없어요. <code>.env</code> 또는 GitHub Secrets에 다음 값을 넣어 주세요:<br />
            {missingEnv.map((k) => <code key={k} style={{ marginRight: 4 }}>{k}</code>)}
          </p>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="pw">비밀번호</label>
            <input id="pw" type="password" autoComplete="current-password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} required />
            <button type="submit" disabled={busy}>{busy ? '확인 중…' : '입장하기'}</button>
          </form>
        )}
        <p className="error" role="status">{msg}</p>
        <p className="tiny">한 번 입장하면 이 브라우저에서는 '잠그기'를 누르기 전까지 유지됩니다.</p>
      </div>
    </div>
  )
}
