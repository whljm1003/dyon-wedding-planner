import type { Num } from './types'

export const money = (n: Num | null | undefined) =>
  n === '' || n == null ? '—' : '₩' + Number(n || 0).toLocaleString('ko-KR')

export const sum = <T,>(list: T[], pick: (x: T) => Num | undefined) =>
  list.reduce((s, x) => s + Number(pick(x) || 0), 0)

export const pct = (done: number, total: number) => (total ? Math.round((done / total) * 100) : 0)

export const uid = (prefix: string) => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
