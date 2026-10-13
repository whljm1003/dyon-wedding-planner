import { useState } from 'react'
import { money, pct, uid } from '../lib/format'
import type { ViewProps } from './types'

const NOTES = [
  ['미국 입국 요건', 'ESTA 승인 여부 또는 비자 필요 여부를 개인별로 확인'],
  ['여행 예산', '항공·숙박·교통·식비·관광·보험·통신·쇼핑·예비비를 분리해 산정'],
  ['예약 관리', '취소 가능 기한과 결제일을 기록'],
]

export function Honeymoon({ data, update }: ViewProps) {
  const [name, setName] = useState('')
  const list = data.tripTasks
  const done = list.filter((x) => x.done).length
  const trip = data.wedding.find((x) => x.name === '신혼여행')

  const add = () => {
    const n = name.trim()
    if (!n) return
    update((d) => { d.tripTasks.push({ id: uid('trip'), name: n, notes: '', done: false }) })
    setName('')
  }

  return (
    <section className="view active">
      <h3 className="section-title">신혼여행 준비</h3>
      <p className="section-desc">미국 여행을 우선 희망하되, 도시와 일정이 정해지기 전 단계부터 관리합니다.</p>
      <div className="hero-grid">
        <div className="hero-card"><div className="eyebrow">DESTINATION</div><h3>미국 · 후보 조사 중</h3><p>도시·기간 미정 · 항공권 가격 비교부터 시작</p></div>
        <div className="hero-card"><div className="eyebrow">BUDGET</div><h3>{trip && trip.budget !== '' ? money(trip.budget) : '예산 미설정'}</h3><p>웨딩 예산의 신혼여행 항목에서 예산과 견적을 입력하세요.</p></div>
        <div className="hero-card"><div className="eyebrow">CHECKLIST</div><h3>{pct(done, list.length)}% 완료</h3><p>완료 {done} / 전체 {list.length}</p></div>
      </div>

      <div className="panel" style={{ marginTop: 14 }}>
        <div className="panel-head"><h3>신혼여행 체크리스트</h3><span className="muted">목적지 미정 상태에서 준비할 항목</span></div>
        <div className="task-list">
          {list.map((x) => (
            <div className="subtask" key={x.id}>
              <input type="checkbox" checked={x.done} onChange={(e) => update((d) => { const t = d.tripTasks.find((i) => i.id === x.id); if (t) t.done = e.target.checked })} />
              <div className="task-main"><div className="task-name">{x.name}</div>{x.notes && <small>{x.notes}</small>}</div>
              <button className="btn sm del" onClick={() => update((d) => { d.tripTasks = d.tripTasks.filter((i) => i.id !== x.id) })}>×</button>
            </div>
          ))}
        </div>
        <div className="trip-add">
          <input placeholder="신혼여행 할 일 추가" value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) add() }} />
          <button className="btn primary" onClick={add}>추가</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>미국 여행 사전 확인</h3></div>
        <div className="notice wide-note">여권 유효기간과 미국 입국 요건(ESTA 또는 비자)은 여행 시점의 공식 안내를 기준으로 확인하세요. 입국 자격은 개인 상황과 여행 목적에 따라 달라질 수 있습니다.</div>
        <div className="task-list">
          {NOTES.map(([a, b]) => <div className="task" key={a}><div className="task-main"><div className="task-name">{a}</div><div className="meta">{b}</div></div></div>)}
        </div>
      </div>
    </section>
  )
}
