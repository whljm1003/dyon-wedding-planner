import type { PlannerData } from '../lib/types'

export interface ViewProps {
  data: PlannerData
  update: (fn: (d: PlannerData) => void) => void
  toast: (msg: string) => void
}

/** 할 일 상태 변경·삭제 공용 핸들러 */
export const taskHandlers = (update: ViewProps['update'], id: string) => ({
  onStatus: (s: string) => update((d) => { const t = d.tasks.find((x) => x.id === id); if (t) t.status = s }),
  onDelete: () => update((d) => { d.tasks = d.tasks.filter((x) => x.id !== id) }),
})
