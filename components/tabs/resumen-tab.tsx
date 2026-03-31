'use client'

import { useState } from 'react'
import { AppData, byKey, totalHours } from '@/lib/store'
import { fmtH } from '@/lib/helpers'

interface ResumenTabProps {
  data: AppData
}

function SummaryTable({
  entries,
  showCost,
  rate,
}: {
  entries: [string, number][]
  showCost: boolean
  rate: number
}) {
  return (
    <table className="summary-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th style={{ textAlign: 'right' }}>Horas</th>
          {showCost && <th style={{ textAlign: 'right' }}>Costo</th>}
        </tr>
      </thead>
      <tbody>
        {entries.length === 0 ? (
          <tr>
            <td colSpan={showCost ? 3 : 2} style={{ color: '#ccc', textAlign: 'center' }}>
              Sin datos
            </td>
          </tr>
        ) : (
          entries.map(([label, val]) => (
            <tr key={label}>
              <td>{label}</td>
              <td
                style={{
                  textAlign: 'right',
                  fontWeight: 700,
                  color: 'var(--bordo)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                }}
              >
                {fmtH(val)}h
              </td>
              {showCost && (
                <td style={{ textAlign: 'right', fontSize: 13, color: 'var(--gray)' }}>
                  ${(val * rate).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

export function ResumenTab({ data }: ResumenTabProps) {
  const [rate, setRate] = useState(0)
  const total = totalHours(data)
  const showCost = rate > 0

  const rubroEntries = byKey(data, 'rubro')
  const personEntries = byKey(data, 'person')

  return (
    <div className="tab-content">
      <div className="section-title">Total del proyecto</div>
      <div
        className="card"
        style={{ background: 'var(--black)', padding: '24px 22px', marginBottom: 12 }}
      >
        <div
          style={{
            fontSize: 11,
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontFamily: 'var(--font-body)',
            marginBottom: 8,
          }}
        >
          Horas totales
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 52,
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1,
          }}
        >
          {fmtH(total)} <span style={{ fontSize: 22, color: '#555' }}>h</span>
        </div>
      </div>

      <div className="card" style={{ padding: '16px 18px', marginBottom: 4 }}>
        <div style={{ fontSize: 11, color: 'var(--gray)', marginBottom: 6, fontWeight: 500 }}>
          Valor hora (opcional)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#bbb', fontSize: 16 }}>$</span>
          <input
            type="number"
            placeholder="0"
            min={0}
            value={rate || ''}
            onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
            style={{
              border: 'none',
              background: 'none',
              fontSize: 22,
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: 'var(--black)',
              padding: 0,
              width: '100%',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div className="section-title">Por rubro</div>
      <div className="card">
        <SummaryTable entries={rubroEntries} showCost={showCost} rate={rate} />
      </div>

      <div className="section-title">Por persona</div>
      <div className="card">
        <SummaryTable entries={personEntries} showCost={showCost} rate={rate} />
      </div>
    </div>
  )
}
