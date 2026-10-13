import { useState } from 'react'
import { MonthCard, monthStats } from '../components/MonthCard'
import { Progress } from '../components/fields'
import { TaskItem } from '../components/TaskItem'
import { MONTHS, monthLabel, STATUSES, TASK_CATEGORIES } from '../lib/defaults'
import { pct, uid } from '../lib/format'
import { taskHandlers, type ViewProps } from './types'

const SCOPES = [
  { name: '예식 준비', cat: '웨딩' },
  { name: '신혼여행', cat: '신혼여행' },
  { name: '신혼집·이사', cat: '이사' },
  { name: '예산·행정', cat: '자금' },
]

export function Monthly({ data, update, toast, month, setMonth }: ViewProps & { month: string; setMonth: (m: string) => void }) {
  const [cat, setCat] = useState('전체 분류')
  const [st, setSt] = useState('전체 상태')
  const [q, setQ] = useState('')
  const [quickName, setQuickName] = useState('')
  const [quickCat, setQuickCat] = useState('웨딩')

  const s = monthStats(data.tasks, month)
  const query = q.trim().toLowerCase()
  const list = data.tasks.filter((t) =>
    t.month === month &&
    (cat === '전체 분류' || t.category === cat) &&
    (st === '전체 상태' || t.status === st) &&
    (!query || t.name.toLowerCase().includes(query) || (t.notes || '').toLowerCase().includes(query)))

  function quickAdd() {
    const name = quickName.trim()
    if (!name) return toast('할 일 이름을 입력하세요')
    update((d) => { d.tasks.push({ id: uid('t'), month, category: quickCat, name, priority: '보통', status: '미확인', due: '', notes: '' }) })
    setQuickName('')
    toast('할 일을 추가했습니다')
  }

  return (
    <section className="view active">
      <h3 className="section-title">월별 체크리스트</h3>
      <p className="section-desc">큰 계획별 전체 준비 현황을 먼저 확인하고, 월별 세부 할 일을 관리하세요.</p>

      <div className="panel">
        <div className="panel-head"><h3>전체 체크리스트 · 큰 계획별</h3><span className="muted">완료 상태가 자동 반영됩니다</span></div>
        <div className="scope-grid">
          {SCOPES.map((sc) => {
            const a = data.tasks.filter((t) => t.category === sc.cat)
            const d = a.filter((t) => t.status === '완료').length
            const p = pct(d, a.length)
            return (
              <div className="scope-card" key={sc.name}>
                <strong>{sc.name}</strong>
                <div className="scope-count">{d} / {a.length} 완료 · {p}%</div>
                <Progress value={p} />
              </div>
            )
          })}
        </div>
      </div>

      <div className="filters">
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {MONTHS.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          {['전체 분류', ...TASK_CATEGORIES].map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={st} onChange={(e) => setSt(e.target.value)}>
          {['전체 상태', ...STATUSES].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input placeholder="할 일 검색" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="panel">
        <div className="panel-head"><h3>{monthLabel(month)} 할 일</h3><span className="pill">{s.pct}% 완료 · {s.done}/{s.total}</span></div>
        <Progress value={s.pct} />
        <div className="task-list" style={{ marginTop: 13 }}>
          {list.length ? list.map((t) => <TaskItem key={t.id} task={t} {...taskHandlers(update, t.id)} />)
            : <div className="muted">조건에 맞는 할 일이 없습니다.</div>}
        </div>
        <div className="quick">
          <input placeholder="이 달에 할 일 추가" value={quickName} onChange={(e) => setQuickName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) quickAdd() }} />
          <select value={quickCat} onChange={(e) => setQuickCat(e.target.value)}>
            {TASK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button className="btn primary" onClick={quickAdd}>추가</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>전체 월별 보기</h3><span className="muted">월을 누르면 해당 월로 이동</span></div>
        <div className="month-grid">
          {MONTHS.map((m) => <MonthCard key={m} tasks={data.tasks} month={m} selected={m === month} onClick={() => setMonth(m)} />)}
        </div>
      </div>
    </section>
  )
}
