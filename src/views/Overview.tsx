import { MonthCard, monthStats } from '../components/MonthCard'
import { TaskItem } from '../components/TaskItem'
import { MONTHS, monthLabel } from '../lib/defaults'
import { money, pct, sum } from '../lib/format'
import { taskHandlers, type ViewProps } from './types'

const ALERTS = [
  ['본식 촬영 800,000원', '예식장 합계에 포함되는지 확인'],
  ['우천 대책', '캐노피·몽골텐트 수량과 설치비 확인'],
  ['식사 150명', '보증 인원·음료 포함 여부 확인'],
  ['전세 자금', '대출·보증금·이사비 계획 별도 입력'],
]

export function Overview({ data, update, goMonth, goView }: ViewProps & { goMonth: (m: string) => void; goView: (v: 'monthly') => void }) {
  const done = data.tasks.filter((t) => t.status === '완료').length
  const total = data.tasks.length
  const p = pct(done, total)
  const venueSum = sum(data.venue, (x) => x.amount)
  const committed = sum(data.wedding, (x) => x.quote)
  const priorities = data.tasks.filter((t) => t.status !== '완료' && ['최우선', '높음'].includes(t.priority)).slice(0, 5)

  return (
    <section className="view active">
      <div className="stats">
        <div className="stat"><div className="label">웨딩 목표 예산</div><div className="value">{money(data.target)}</div><div className="hint">목표 범위 2,000만~3,000만 원</div></div>
        <div className="stat"><div className="label">예식장 계약서 합계</div><div className="value">{money(venueSum)}</div><div className="hint">계약서 항목 금액 합계 · 추가 확인 필요</div></div>
        <div className="stat"><div className="label">목표 대비 잔여</div><div className="value">{money(data.target - committed)}</div><div className="hint">웨딩 예산 실제 견적 기준</div></div>
        <div className="stat"><div className="label">전체 할 일 완료율</div><div className="value">{p}%</div><div className="hint">완료 {done} / 전체 {total}</div></div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>전체 준비 진행률</h3><span className="muted">월별 체크리스트 기준 · 완료 상태에 따라 갱신</span></div>
        <div className="big-progress">
          <svg className="ring" viewBox="0 0 100 100" aria-label="전체 진행률">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#efeee8" strokeWidth="9" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#586c58" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={`${(done / (total || 1)) * 251.3} 251.3`} transform="rotate(-90 50 50)" />
            <text x="50" y="55" textAnchor="middle">{p}%</text>
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="value">{done} / {total} 완료</div>
            <p className="muted">월별 진행률을 비교해 준비가 밀리는 시기를 확인하세요.</p>
            <div className="progress-chart">
              {MONTHS.map((m) => {
                const s = monthStats(data.tasks, m)
                return (
                  <div className="chart-row" key={m}>
                    <span className="chart-label">{monthLabel(m).replace('년 ', '/').replace('월', '')}</span>
                    <div className="chart-track"><div className="chart-fill" style={{ width: s.pct + '%' }} /></div>
                    <span className="muted" style={{ textAlign: 'right' }}>{s.pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="layout">
        <div className="panel">
          <div className="panel-head"><h3>우선 처리할 일</h3><span className="pill high">최우선</span></div>
          <p className="muted">2026년 10~12월은 웨딩 예약, 2027년 1~3월은 전세 계약과 이사에 집중합니다.</p>
          <div className="task-list">
            {priorities.length ? priorities.map((t) => <TaskItem key={t.id} task={t} {...taskHandlers(update, t.id)} />)
              : <div className="muted">우선 할 일이 없습니다.</div>}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>월별 진행률</h3><button className="btn sm" onClick={() => goView('monthly')}>전체 보기</button></div>
          <div className="task-list">
            {MONTHS.map((m) => <MonthCard key={m} tasks={data.tasks} month={m} onClick={() => goMonth(m)} />)}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>계약서 확인 사항</h3><span className="pill">확인 필요</span></div>
        <div className="task-list">
          {ALERTS.map(([a, b]) => <div className="task" key={a}><div className="task-main"><div className="task-name">{a}</div><div className="meta">{b}</div></div></div>)}
        </div>
      </div>
    </section>
  )
}
