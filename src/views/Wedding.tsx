import { NumInput, StatusSelect, TextInput } from '../components/fields'
import { money, sum, uid } from '../lib/format'
import type { Num, VenueItem, WeddingItem } from '../lib/types'
import type { ViewProps } from './types'

export function Wedding({ data, update, toast, onAdd }: ViewProps & { onAdd: () => void }) {
  const committed = sum(data.wedding, (x) => x.quote)

  const editW = <K extends keyof WeddingItem>(id: string, key: K, value: WeddingItem[K]) =>
    update((d) => {
      const x = d.wedding.find((i) => i.id === id)
      if (!x) return
      x[key] = value
      // 실제 견적 - 계약금 = 잔금 자동 계산
      if ((key === 'quote' || key === 'deposit') && x.quote !== '' && x.deposit !== '') x.balance = Number(x.quote) - Number(x.deposit)
    })

  const editV = <K extends keyof VenueItem>(id: string, key: K, value: VenueItem[K]) =>
    update((d) => {
      const x = d.venue.find((i) => i.id === id)
      if (!x) return
      x[key] = value
      // 단가 × 수량 = 금액 자동 계산
      if ((key === 'unit' || key === 'qty') && x.unit !== '' && x.qty !== '') x.amount = Number(x.unit) * Number(x.qty)
    })

  const num = (fn: (v: Num) => void) => (v: Num) => fn(v)

  return (
    <section className="view active">
      <h3 className="section-title">웨딩 예산</h3>
      <p className="section-desc">예산·실제 견적·계약금·잔금을 수정할 수 있습니다.</p>
      <div className="stats" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <div className="stat">
          <div className="label">목표 예산</div>
          <div className="value">{money(data.target)}</div>
          <div className="hint" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            수정
            <input type="number" min={0} step={1000000} value={data.target} style={{ width: 130, padding: 4, border: '1px solid var(--line)', borderRadius: 6 }}
              onChange={(e) => update((d) => { d.target = Number(e.target.value) || 0 })} />
          </div>
        </div>
        <div className="stat"><div className="label">실제 견적 합계</div><div className="value">{money(committed)}</div></div>
        <div className="stat"><div className="label">잔여 예산</div><div className="value">{money(data.target - committed)}</div></div>
      </div>
      <div className="notice">계약서 합계 15,191,000원은 기획진행비, 음향, 조화 장식, 의자, 테이블, 운송·설치, 뷔페 150명 × 66,000원 기준입니다. 본식 촬영 800,000원은 합계 포함 여부를 확인하세요.</div>

      <div className="panel">
        <div className="panel-head"><h3>웨딩 비용 항목</h3><button className="btn sm" onClick={onAdd}>+ 항목 추가</button></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>항목</th><th>예산</th><th>실제 견적</th><th>계약금</th><th>잔금</th><th>지급일</th><th>상태</th><th></th></tr></thead>
            <tbody>
              {data.wedding.map((x) => (
                <tr key={x.id}>
                  <td><TextInput value={x.name} onChange={(v) => editW(x.id, 'name', v)} /></td>
                  <td><NumInput value={x.budget} onChange={num((v) => editW(x.id, 'budget', v))} /></td>
                  <td><NumInput value={x.quote} onChange={num((v) => editW(x.id, 'quote', v))} /></td>
                  <td><NumInput value={x.deposit} onChange={num((v) => editW(x.id, 'deposit', v))} /></td>
                  <td><NumInput value={x.balance} onChange={num((v) => editW(x.id, 'balance', v))} /></td>
                  <td><TextInput type="date" value={x.due} onChange={(v) => editW(x.id, 'due', v)} /></td>
                  <td><StatusSelect value={x.status} onChange={(v) => editW(x.id, 'status', v)} /></td>
                  <td><button className="btn sm del" onClick={() => update((d) => { d.wedding = d.wedding.filter((i) => i.id !== x.id) })}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>예식장 계약서 항목</h3>
          <div className="actions">
            <span className="muted">단가·수량 입력 시 금액 자동 계산</span>
            <button className="btn sm" onClick={() => { update((d) => { d.venue.push({ id: uid('v'), name: '새 계약 항목', unit: '', qty: '', amount: '', status: '미확인', notes: '' }) }); toast('계약서 항목을 추가했습니다') }}>+ 계약 항목 추가</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>항목</th><th>단가</th><th>수량</th><th>금액</th><th>상태</th><th>메모</th><th></th></tr></thead>
            <tbody>
              {data.venue.map((x) => (
                <tr key={x.id}>
                  <td><TextInput value={x.name} onChange={(v) => editV(x.id, 'name', v)} /></td>
                  <td><NumInput value={x.unit} onChange={num((v) => editV(x.id, 'unit', v))} /></td>
                  <td><NumInput value={x.qty} onChange={num((v) => editV(x.id, 'qty', v))} /></td>
                  <td><NumInput value={x.amount} onChange={num((v) => editV(x.id, 'amount', v))} /></td>
                  <td><StatusSelect value={x.status} onChange={(v) => editV(x.id, 'status', v)} /></td>
                  <td><TextInput value={x.notes} onChange={(v) => editV(x.id, 'notes', v)} /></td>
                  <td><button className="btn sm del" onClick={() => update((d) => { d.venue = d.venue.filter((i) => i.id !== x.id) })}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
