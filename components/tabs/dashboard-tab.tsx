'use client'

import { AppData, fmtH, fmtDateShort, byKey, totalHours } from '@/lib/store'

interface DashboardTabProps {
  data: AppData
}

export function DashboardTab({ data }: DashboardTabProps) {
  const total = totalHours(data)
  const uniquePeople = [...new Set(data.records.map((r) => r.person))].length
  const uniqueRubros = [...new Set(data.records.map((r) => r.rubro))].length

  const recent = [...data.records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)

  return (
    <div className="tab-content">
      <div className="stats-grid">
        <div className="stat-card dark">
          <div className="stat-label">Total horas</div>
          <div className="stat-value">
            {fmtH(total)}
            <span className="stat-unit">h</span>
          </div>
        </div>
        <div className="stat-card light">
          <div className="stat-label">Registros</div>
          <div className="stat-value">{data.records.length}</div>
        </div>
        <div className="stat-card light">
          <div className="stat-label">Personas</div>
          <div className="stat-value">{uniquePeople}</div>
        </div>
        <div className="stat-card light">
          <div className="stat-label">Rubros</div>
          <div className="stat-value">{uniqueRubros}</div>
        </div>
      </div>

      <div className="section-title">Actividad reciente</div>
      <div className="card">
        {recent.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">◻</div>
            Sin registros aún.
            <br />
            Tocá <strong>{'"+ Agregar registro"'}</strong> para empezar.
          </div>
        ) : (
          recent.map((r) => (
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
              <div className="record-right">
                <div className="record-hours">{fmtH(r.hours)}h</div>
                <div className="record-date-small">{fmtDateShort(r.date)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
