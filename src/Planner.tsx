import { signOut } from 'firebase/auth'
import { useCallback, useRef, useState } from 'react'
import { Modal, type ModalMode } from './components/Modal'
import { auth } from './lib/firebase'
import { uid } from './lib/format'
import { migrate } from './lib/migrate'
import type { PlannerData, ViewKey } from './lib/types'
import { usePlanner } from './lib/usePlanner'
import { Home } from './views/Home'
import { Honeymoon } from './views/Honeymoon'
import { Monthly } from './views/Monthly'
import { Overview } from './views/Overview'
import { Vendors } from './views/Vendors'
import { Wedding } from './views/Wedding'

const NAV: [ViewKey, string][] = [
  ['overview', '◫　대시보드'], ['monthly', '▦　월별 체크리스트'], ['wedding', '♡　웨딩 예산'],
  ['honeymoon', '✈　신혼여행'], ['home', '⌂　전세·이사 자금'], ['vendors', '↗　업체 관리'],
]
const TITLES: Record<ViewKey, [string, string]> = {
  overview: ['전체 준비 현황', '웨딩과 이사 일정을 한곳에서 관리하세요.'],
  monthly: ['월별 체크리스트', '달별 할 일과 진행 상태를 관리하세요.'],
  wedding: ['웨딩 예산', '목표 예산과 실제 지출을 관리하세요.'],
  honeymoon: ['신혼여행', '미국 여행을 희망하는 단계부터 준비를 정리하세요.'],
  home: ['전세·이사 자금', '전세 자금은 웨딩 예산과 분리합니다.'],
  vendors: ['업체 관리', '견적과 계약금·잔금 일정을 기록하세요.'],
}

export function Planner() {
  const { data, status, error, update, replace } = usePlanner()
  const [view, setView] = useState<ViewKey>('overview')
  const [month, setMonth] = useState('2026-10')
  const [modal, setModal] = useState<ModalMode | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  const toastTimer = useRef<number>()
  const fileRef = useRef<HTMLInputElement>(null)

  const toast = useCallback((s: string) => {
    setToastMsg(s)
    clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToastMsg(''), 1900)
  }, [])

  const go = (v: ViewKey) => { setView(v); window.scrollTo({ top: 0 }) }
  const goMonth = (m: string) => { setMonth(m); go('monthly') }

  if (error) return <div className="splash" style={{ padding: 20, textAlign: 'center' }}>불러오지 못했어요: {error}</div>
  if (!data) return <div className="splash">플래너를 불러오는 중…</div>

  function exportBackup() {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = `our-day-wedding-planner-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    toast('백업 파일을 내보냈습니다')
  }

  async function importBackup(file?: File) {
    if (!file) return
    try {
      const x = JSON.parse(await file.text()) as PlannerData
      if (!x.tasks || !x.wedding) throw new Error('invalid')
      if (!confirm('백업 파일 내용으로 현재 데이터를 덮어씁니다. 계속할까요?')) return
      replace(migrate(x))
      toast('백업을 가져왔습니다')
    } catch {
      toast('올바른 백업 파일이 아닙니다')
    }
  }

  function submitModal(mode: ModalMode, v: Record<string, any>) {
    update((d) => {
      const id = uid('new')
      if (mode === 'task') d.tasks.push({ id, month: v.month, category: v.category, name: v.name, priority: v.priority, status: '미확인', due: v.due ?? '', notes: v.notes ?? '' })
      if (mode === 'wedding') d.wedding.push({ id, name: v.name, budget: v.budget, quote: v.quote, deposit: v.deposit, balance: v.balance, due: v.due ?? '', status: '미확인', notes: '' })
      if (mode === 'home') d.home.push({ id, name: v.name, budget: v.budget, actual: v.actual, due: v.due ?? '', status: '미확인', notes: v.notes ?? '' })
      if (mode === 'vendor') d.vendors.push({ id, category: v.category, name: v.name, contact: v.contact ?? '', quote: v.quote, deposit: v.deposit, balance: v.balance, due: v.due ?? '', status: '문의 중', notes: '' })
    })
    setModal(null)
    toast('저장했습니다')
  }

  const props = { data, update, toast }

  return (
    <>
      <div className="app">
        <aside className="side">
          <div className="brand"><small>OUR DAY · 2027</small><h1>Wedding planner</h1><p>야외 웨딩 & 신혼집 준비</p></div>
          <nav className="nav">
            {NAV.map(([k, label]) => <button key={k} className={view === k ? 'active' : ''} onClick={() => go(k)}>{label}</button>)}
          </nav>
          <div className="side-note">2027.09.11 · 토요일 오전<br />IMHS 야외 웨딩<br /><br />변경 사항은 클라우드에 자동 저장되고<br />두 사람의 기기에 실시간 반영됩니다.</div>
        </aside>
        <main>
          <header className="top">
            <div>
              <div className="eyebrow">SATURDAY, SEPTEMBER 11, 2027 · IMHS</div>
              <h2>{TITLES[view][0]}</h2>
              <p className="sub">{TITLES[view][1]}</p>
            </div>
            <div className="actions">
              <span className="cloud-status">{status}</span>
              <button className="btn" onClick={() => auth && signOut(auth)}>잠그기</button>
              <button className="btn" onClick={exportBackup}>백업 내보내기</button>
              <button className="btn" onClick={() => fileRef.current?.click()}>백업 가져오기</button>
              {view === 'monthly' && <button className="btn primary" onClick={() => setModal('task')}>+ 할 일 추가</button>}
              <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => { importBackup(e.target.files?.[0]); e.target.value = '' }} />
            </div>
          </header>

          {view === 'overview' && <Overview {...props} goMonth={goMonth} goView={go} />}
          {view === 'monthly' && <Monthly {...props} month={month} setMonth={setMonth} />}
          {view === 'wedding' && <Wedding {...props} onAdd={() => setModal('wedding')} />}
          {view === 'honeymoon' && <Honeymoon {...props} />}
          {view === 'home' && <Home {...props} onAdd={() => setModal('home')} />}
          {view === 'vendors' && <Vendors {...props} onAdd={() => setModal('vendor')} />}

          <p className="foot">데이터는 Firebase에 저장됩니다. 중요한 변경 전에는 가끔 백업 파일을 내보내 두세요.</p>
        </main>
      </div>
      {modal && <Modal mode={modal} defaultMonth={month} onClose={() => setModal(null)} onSubmit={submitModal} />}
      <div className={'toast' + (toastMsg ? ' show' : '')}>{toastMsg}</div>
    </>
  )
}
