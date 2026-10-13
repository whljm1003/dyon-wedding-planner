import { NumInput, StatusSelect, TextInput } from '../components/fields'
import { money, sum } from '../lib/format'
import type { HomeItem } from '../lib/types'
import type { ViewProps } from './types'

export function Home({ data, update, onAdd }: ViewProps & { onAdd: () => void }) {
  const edit = <K extends keyof HomeItem>(id: string, key: K, value: HomeItem[K]) =>
    update((d) => { const x = d.home.find((i) => i.id === id); if (x) x[key] = value })
  const blank = data.home.filter((x) => x.budget === '' || x.budget == null).length

  return (
    <section className="view active">
      <h3 className="section-title">전세·이사 자금</h3>
      <p className="section-desc">웨딩 예산과 분리해 보증금, 이사비, 입주 비용을 관리하세요.</p>
      <div className="stats" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <div className="stat"><div className="label">예산 합계</div><div className="value">{money(sum(data.home, (x) => x.budget))}</div></div>
        <div className="stat"><div className="label">실제 비용 합계</div><div className="value">{money(sum(data.home, (x) => x.actual))}</div></div>
        <div className="stat"><div className="label">예산 미입력</div><div className="value">{blank}</div></div>
      </div>
      <div className="panel">
        <div className="panel-head"><h3>전세·이사 비용 항목</h3><button className="btn sm" onClick={onAdd}>+ 항목 추가</button></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>항목</th><th>예산</th><th>실제 금액</th><th>지급일</th><th>상태</th><th>메모</th><th></th></tr></thead>
            <tbody>
              {data.home.map((x) => (
                <tr key={x.id}>
                  <td><TextInput value={x.name} onChange={(v) => edit(x.id, 'name', v)} /></td>
                  <td><NumInput value={x.budget} onChange={(v) => edit(x.id, 'budget', v)} /></td>
                  <td><NumInput value={x.actual} onChange={(v) => edit(x.id, 'actual', v)} /></td>
                  <td><TextInput type="date" value={x.due} onChange={(v) => edit(x.id, 'due', v)} /></td>
                  <td><StatusSelect value={x.status} onChange={(v) => edit(x.id, 'status', v)} /></td>
                  <td><TextInput value={x.notes} onChange={(v) => edit(x.id, 'notes', v)} /></td>
                  <td><button className="btn sm del" onClick={() => update((d) => { d.home = d.home.filter((i) => i.id !== x.id) })}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel">
        <h3 style={{ margin: '0 0 12px' }}>전세 계약 전 확인</h3>
        <div className="task-list">
          {data.safety.map((x, i) => (
            <div className="task" key={i}>
              <input type="checkbox" checked={!!data.safeDone[i]} onChange={(e) => update((d) => { d.safeDone[i] = e.target.checked })} />
              <div className="task-main">{x}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
