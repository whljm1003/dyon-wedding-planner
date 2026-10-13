import { STATUSES } from '../lib/defaults'
import type { Num } from '../lib/types'

export function TextInput({ value, onChange, type = 'text' }: { value: string; onChange: (v: string) => void; type?: string }) {
  return <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
}

export function NumInput({ value, onChange }: { value: Num; onChange: (v: Num) => void }) {
  return (
    <input type="number" min={0} value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
  )
}

export function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  // 저장된 값이 목록에 없더라도(예: '확인 중') 그대로 보이도록 포함
  const opts = options.includes(value) || !value ? options : [value, ...options]
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {opts.map((s) => <option key={s}>{s}</option>)}
    </select>
  )
}

export const StatusSelect = (p: { value: string; onChange: (v: string) => void }) => <Select options={STATUSES} {...p} />

export function Progress({ value }: { value: number }) {
  return <div className="progress"><span style={{ width: value + '%' }} /></div>
}
