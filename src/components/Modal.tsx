import type { FormEvent } from 'react'
import { MONTHS, monthLabel, TASK_CATEGORIES, VENDOR_CATEGORIES } from '../lib/defaults'

export type ModalMode = 'task' | 'wedding' | 'home' | 'vendor'

type Spec = [key: string, label: string, type: string]
const SPECS: Record<ModalMode, Spec[]> = {
  task: [['name', '할 일', 'text'], ['month', '월', 'month'], ['category', '분류', 'taskCategory'], ['priority', '우선순위', 'priority'], ['due', '마감일', 'date'], ['notes', '메모', 'text']],
  wedding: [['name', '항목명', 'text'], ['budget', '예산', 'number'], ['quote', '실제 견적', 'number'], ['deposit', '계약금', 'number'], ['balance', '잔금', 'number'], ['due', '지급일', 'date']],
  home: [['name', '항목명', 'text'], ['budget', '예산', 'number'], ['actual', '실제 금액', 'number'], ['due', '지급일', 'date'], ['notes', '메모', 'text']],
  vendor: [['category', '분류', 'vendorCategory'], ['name', '업체명', 'text'], ['contact', '연락처·링크', 'text'], ['quote', '견적', 'number'], ['deposit', '계약금', 'number'], ['balance', '잔금', 'number'], ['due', '지급일', 'date']],
}
const TITLES: Record<ModalMode, string> = { task: '할 일 추가', wedding: '웨딩 비용 항목 추가', home: '전세·이사 비용 항목 추가', vendor: '업체 추가' }

const optionsFor = (type: string): [string, string][] =>
  type === 'month' ? MONTHS.map((m) => [m, monthLabel(m)])
  : type === 'taskCategory' ? TASK_CATEGORIES.map((v) => [v, v])
  : type === 'vendorCategory' ? VENDOR_CATEGORIES.map((v) => [v, v])
  : type === 'priority' ? ['최우선', '높음', '보통'].map((v) => [v, v])
  : []

interface Props {
  mode: ModalMode
  defaultMonth: string
  onClose: () => void
  onSubmit: (mode: ModalMode, values: Record<string, string | number>) => void
}

export function Modal({ mode, defaultMonth, onClose, onSubmit }: Props) {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const values: Record<string, string | number> = {}
    for (const [k, v] of new FormData(e.currentTarget).entries()) {
      const s = String(v)
      values[k] = SPECS[mode].find(([key]) => key === k)?.[2] === 'number' ? (s === '' ? '' : Number(s)) : s
    }
    onSubmit(mode, values)
  }
  return (
    <div className="modal-bg show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <h3>{TITLES[mode]}</h3>
        <div className="fields">
          {SPECS[mode].map(([k, label, type]) => {
            const opts = optionsFor(type)
            return (
              <div key={k} className={'field' + (k === 'notes' ? ' full' : '')}>
                <label>{label}</label>
                {opts.length ? (
                  <select name={k} defaultValue={k === 'month' ? defaultMonth : undefined}>
                    {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                ) : (
                  <input name={k} type={type} min={type === 'number' ? 0 : undefined} required={k === 'name'} />
                )}
              </div>
            )
          })}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>취소</button>
          <button className="btn primary">저장</button>
        </div>
      </form>
    </div>
  )
}
