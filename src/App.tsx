import { PasswordGate } from './components/PasswordGate'
import { useAuth } from './lib/useAuth'
import { Planner } from './Planner'

export default function App() {
  const { user, ready } = useAuth()
  if (!ready) return <div className="splash">확인 중…</div>
  return user ? <Planner /> : <PasswordGate />
}
