import { monthLabel } from '../lib/defaults'
import type { Task } from '../lib/types'
import { StatusSelect } from './fields'

interface Props {
  task: Task
  onStatus: (status: string) => void
  onDelete: () => void
}

export function TaskItem({ task: t, onStatus, onDelete }: Props) {
  const done = t.status === '완료'
  return (
    <div className={'task' + (done ? ' done' : '')}>
      <input type="checkbox" checked={done} onChange={(e) => onStatus(e.target.checked ? '완료' : '진행 중')} />
      <div className="task-main">
        <div className="task-name">{t.name}</div>
        <div className="meta">
          {monthLabel(t.month)} · {t.category} · <span className={'pill' + (t.priority === '최우선' ? ' high' : '')}>{t.priority}</span>
          {t.due && ' · 기한 ' + t.due}
          {t.notes && ' · ' + t.notes}
        </div>
      </div>
      <StatusSelect value={t.status} onChange={onStatus} />
      <button className="btn sm del" onClick={onDelete} aria-label="삭제">×</button>
    </div>
  )
}
