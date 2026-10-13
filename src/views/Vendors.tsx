import { NumInput, Select, TextInput } from '../components/fields'
import { VENDOR_CATEGORIES, VENDOR_STATUSES } from '../lib/defaults'
import type { Vendor } from '../lib/types'
import type { ViewProps } from './types'

export function Vendors({ data, update, onAdd }: ViewProps & { onAdd: () => void }) {
  const edit = <K extends keyof Vendor>(id: string, key: K, value: Vendor[K]) =>
    update((d) => { const x = d.vendors.find((i) => i.id === id); if (x) x[key] = value })

  return (
    <section className="view active">
      <h3 className="section-title">업체 관리</h3>
      <p className="section-desc">연락처, 견적, 계약금·잔금 지급일을 기록하세요.</p>
      <div className="panel">
        <div className="panel-head"><h3>업체 목록</h3><button className="btn sm" onClick={onAdd}>+ 업체 추가</button></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>분류</th><th>업체명</th><th>연락처·링크</th><th>견적</th><th>계약금</th><th>잔금</th><th>지급일</th><th>상태</th><th></th></tr></thead>
            <tbody>
              {data.vendors.map((x) => (
                <tr key={x.id}>
                  <td><Select value={x.category} options={VENDOR_CATEGORIES} onChange={(v) => edit(x.id, 'category', v)} /></td>
                  <td><TextInput value={x.name} onChange={(v) => edit(x.id, 'name', v)} /></td>
                  <td><TextInput value={x.contact} onChange={(v) => edit(x.id, 'contact', v)} /></td>
                  <td><NumInput value={x.quote} onChange={(v) => edit(x.id, 'quote', v)} /></td>
                  <td><NumInput value={x.deposit} onChange={(v) => edit(x.id, 'deposit', v)} /></td>
                  <td><NumInput value={x.balance} onChange={(v) => edit(x.id, 'balance', v)} /></td>
                  <td><TextInput type="date" value={x.due} onChange={(v) => edit(x.id, 'due', v)} /></td>
                  <td><Select value={x.status} options={VENDOR_STATUSES} onChange={(v) => edit(x.id, 'status', v)} /></td>
                  <td><button className="btn sm del" onClick={() => update((d) => { d.vendors = d.vendors.filter((i) => i.id !== x.id) })}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel">
        <h3 style={{ margin: '0 0 12px' }}>업체 계약 전 확인</h3>
        <div className="task-list">
          {data.checks.map((x, i) => (
            <div className="task" key={i}>
              <input type="checkbox" checked={!!data.checkDone[i]} onChange={(e) => update((d) => { d.checkDone[i] = e.target.checked })} />
              <div className="task-main">{x}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
