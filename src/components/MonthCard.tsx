import { monthLabel } from '../lib/defaults'
import { pct } from '../lib/format'
import type { Task } from '../lib/types'
import { Progress } from './fields'

export function monthStats(tasks: Task[], m: string) {
  const all = tasks.filter((t) => t.month === m)
  const done = all.filter((t) => t.status === '완료').length
  return { total: all.length, done, pct: pct(done, all.length) }
}

export function MonthCard({ tasks, month, selected, onClick }: { tasks: Task[]; month: string; selected?: boolean; onClick: () => void }) {
  const s = monthStats(tasks, month)
  return (
    <button className={'month-card' + (selected ? ' selected' : '')} onClick={onClick}>
      <strong>{monthLabel(month)}</strong>
      <small>{s.done}/{s.total} 완료</small>
      <Progress value={s.pct} />
    </button>
  )
}
