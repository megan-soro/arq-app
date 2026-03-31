'use client'

import { AppData } from '@/lib/types'
import { fmtH, fmtDate, fmtDateShort } from '@/lib/helpers'
import { Record } from '@/lib/types'

interface RegistrosTabProps {
  data: AppData
  onDelete: (id: string) => void
}

export function RegistrosTab({ data, onDelete }: RegistrosTabProps) {
  const sorted = [...data.records].sort((a, b) => b.fecha.localeCompare(a.fecha))

  const grouped: { [date: string]: Record[] } = {}
  sorted.forEach((r) => {
    if (!grouped[r.fecha]) grouped[r.fecha] = []
    grouped[r.fecha].push(r)
  })

  if (sorted.length === 0) {
    return (
      <div className="tab-content">
        <div className="empty">
          <div className="empty-icon">◻</div>
          Sin registros aún.
        </div>
      </div>
    )
  }

  return (
    <div className="tab-content">
      {Object.keys(grouped)
        .sort((a, b) => b.localeCompare(a))
        .map((date) => (
          <div key={date}>
            <div className="record-group-date">{fmtDate(date)}</div>
            <div className="card">
              {grouped[date].map((r) => (
                <div key={r.id} className="record-item">
                  <div>
                    <div className="record-main">{r.rubro}</div>
                    <div className="record-meta">
                      {r.person} · {r.stage}
                      {r.notes && (
                        <>
                          {' · '}
                          <em>{r.notes}</em>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="record-right">
                      <div className="record-hours">{fmtH(r.hours)}h</div>
                      <div className="record-date-small">{fmtDateShort(r.fecha)}</div>
                    </div>
                    <button className="record-delete" onClick={() => onDelete(r.id)} title="Eliminar">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
