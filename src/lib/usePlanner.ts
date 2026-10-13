import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { db } from './firebase'
import { createDefaults } from './defaults'
import { migrate, toPlain } from './migrate'
import type { PlannerData } from './types'

const SAVE_DELAY = 700
const fmtTime = () => new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

/**
 * Firestore `planner/main` 문서 하나에 플래너 전체를 저장합니다.
 * - 실시간 구독: 다른 기기에서 바꾼 내용이 바로 반영
 * - 저장: 수정 후 0.7초 뒤 한 번에 저장(debounce)
 */
export function usePlanner() {
  const [data, setData] = useState<PlannerData | null>(null)
  const [status, setStatus] = useState('불러오는 중…')
  const [error, setError] = useState<string | null>(null)
  const dataRef = useRef<PlannerData | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const ref = db ? doc(db, 'planner', 'main') : null

  const flush = useCallback(async () => {
    if (!ref || !dataRef.current) return
    timer.current = undefined
    setStatus('저장 중…')
    try {
      await setDoc(ref, { data: toPlain(dataRef.current), updatedAt: serverTimestamp() })
      setStatus('저장 완료 · ' + fmtTime())
    } catch (e) {
      console.error(e)
      setStatus('저장 실패 · 백업 내보내기 권장')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!ref) return
    return onSnapshot(
      ref,
      (snap) => {
        // 내가 방금 보낸 쓰기, 또는 아직 보내지 않은 수정이 있으면 덮어쓰지 않음
        if (snap.metadata.hasPendingWrites || timer.current !== undefined) return
        if (!snap.exists()) {
          const d = createDefaults()
          dataRef.current = d
          setData(d)
          setDoc(ref, { data: toPlain(d), updatedAt: serverTimestamp() }).catch((e) => setError(String(e?.message ?? e)))
          setStatus('기본 데이터 생성')
          return
        }
        const d = migrate(snap.data().data)
        dataRef.current = d
        setData(d)
        setStatus(snap.metadata.fromCache ? '오프라인 · 연결되면 동기화' : '동기화됨 · ' + fmtTime())
      },
      (e) => {
        console.error(e)
        setError(e.code === 'permission-denied' ? 'Firestore 보안 규칙에서 접근이 거부됐어요. 규칙의 이메일을 확인하세요.' : e.message)
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 탭을 닫기 전에 대기 중인 저장 즉시 실행
  useEffect(() => {
    const onHide = () => { if (timer.current !== undefined) { clearTimeout(timer.current); flush() } }
    window.addEventListener('pagehide', onHide)
    return () => window.removeEventListener('pagehide', onHide)
  }, [flush])

  /** draft를 직접 수정하는 함수를 받아 상태 갱신 + 저장 예약 */
  const update = useCallback((fn: (draft: PlannerData) => void) => {
    if (!dataRef.current) return
    const next = structuredClone(dataRef.current)
    fn(next)
    dataRef.current = next
    setData(next)
    setStatus('저장 대기 중…')
    clearTimeout(timer.current)
    timer.current = window.setTimeout(flush, SAVE_DELAY)
  }, [flush])

  const replace = useCallback((next: PlannerData) => update((d) => { Object.assign(d, next) }), [update])

  return { data, status, error, update, replace }
}
