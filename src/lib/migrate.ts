import { createDefaults, DEFAULTS } from './defaults'
import type { PlannerData } from './types'

/** 저장된 데이터(또는 백업 파일)를 현재 기본 구조에 맞춰 보정 */
export function migrate(raw: Partial<PlannerData> | undefined | null): PlannerData {
  const data: PlannerData = Object.assign(createDefaults(), raw ?? {})

  // 기본 할 일 중 빠진 항목 추가 (이름 기준)
  const names = new Set(data.tasks.map((t) => t.name))
  for (const t of DEFAULTS.tasks) if (!names.has(t.name)) data.tasks.push(structuredClone(t))

  if (!Array.isArray(data.tripTasks) || data.tripTasks.length === 0) data.tripTasks = structuredClone(DEFAULTS.tripTasks)
  if (!Array.isArray(data.safeDone)) data.safeDone = []
  if (!Array.isArray(data.checkDone)) data.checkDone = []

  if (!data.wedding.some((x) => x.name === '신혼여행')) {
    const reserve = data.wedding.find((x) => x.name === '예비비')
    if (reserve && Number(reserve.budget) === 2809000) reserve.budget = 1809000
    data.wedding.push(structuredClone(DEFAULTS.wedding.find((x) => x.name === '신혼여행')!))
  }
  return data
}

/** Firestore는 undefined·배열 구멍을 싫어하므로 JSON 왕복으로 정리 */
export const toPlain = <T,>(v: T): T => JSON.parse(JSON.stringify(v))
