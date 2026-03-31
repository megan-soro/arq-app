'use client'

import { useState } from 'react'
import { AppData, byKey, byPersonDetail } from '@/lib/store'
import { fmtH, getColor } from '@/lib/helpers'

interface AnalisisTabProps {
  data: AppData
}

function PieChart({ entries }: { entries: [string, number][] }) {
  const total = entries.reduce((s, [, v]) => s + v, 0)
  if (total === 0) return null

  const cx = 90,
    cy = 90,
    r = 76
  let angle = -Math.PI / 2

  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      {entries.map(([label, val], i) => {
        const pct = val / total
        const sweep = pct * 2 * Math.PI
        const x1 = cx + r * Math.cos(angle)
        const y1 = cy + r * Math.sin(angle)
        angle += sweep
        const x2 = cx + r * Math.cos(angle)
        const y2 = cy + r * Math.sin(angle)
        const large = sweep > Math.PI ? 1 : 0

        return (
          <path
            key={label}
            d={`M${cx},${cy} L${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} Z`}
            fill={getColor(i)}
            opacity="0.9"
          >
            <title>
              {label}: {fmtH(val)}h ({Math.round(pct * 100)}%)
            </title>
          </path>
        )
      })}
      <circle cx={cx} cy={cy} r={r * 0.45} fill="white" />
    </svg>
  )
}

function BarChart({ entries }: { entries: [string, number][] }) {
  const max = Math.max(...entries.map(([, v]) => v), 1)

  if (entries.length === 0) {
    return <div style={{ color: '#ccc', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>Sin datos</div>
  }

  return (
    <>
      {entries.map(([label, val], i) => (
        <div key={label} className="bar-row">
          <div className="bar-row-header">
            <span className="bar-label">{label}</span>
            <span className="bar-value">{fmtH(val)}h</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(val / max) * 100}%`, background: getColor(i) }} />
          </div>
        </div>
      ))}
    </>
  )
}

function PersonAccordion({ data }: { data: AppData }) {
  const [openPersons, setOpenPersons] = useState<Set<string>>(new Set())
  const people = byPersonDetail(data)

  const togglePerson = (name: string) => {
    setOpenPersons((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  if (people.length === 0) {
    return (
      <div className="card">
        <div className="empty">Sin datos</div>
      </div>
    )
  }

  return (
    <div className="card">
      {people.map(([name, d], i) => (
        <div key={name} className="person-card">
          <div className="person-header" onClick={() => togglePerson(name)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="person-avatar" style={{ background: getColor(i) }}>
                {name[0].toUpperCase()}
              </div>
              <span className="person-name">{name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="person-total">{fmtH(d.total)}h</span>
              <span className={`chevron ${openPersons.has(name) ? 'open' : ''}`}>▼</span>
            </div>
          </div>
          <div className={`person-detail ${openPersons.has(name) ? 'open' : ''}`}>
            {Object.entries(d.rubros)
              .sort((a, b) => b[1] - a[1])
              .map(([rubro, h]) => (
                <div key={rubro} className="person-detail-row">
                  <span>{rubro}</span>
                  <span>{fmtH(h)}h</span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function LineChart({ data }: { data: AppData }) {
  const byDay: { [date: string]: number } = {}
  data.records.forEach((r) => {
    byDay[r.date] = (byDay[r.date] || 0) + r.hours
  })
  const days = Object.keys(byDay).sort()

  if (days.length < 2) {
    return (
      <svg width="100%" height="110" viewBox="0 0 340 110" preserveAspectRatio="xMidYMid meet">
        <text x="170" y="55" textAnchor="middle" fontSize="12" fill="#ccc" fontFamily="'DM Sans',sans-serif">
          Necesitás al menos 2 días de datos
        </text>
      </svg>
    )
  }

  const vals = days.map((d) => byDay[d])
  const max = Math.max(...vals)
  const W = 340,
    H = 100,
    padX = 28,
    padY = 14

  const pts = days.map((_, i) => {
    const x = padX + (i / (days.length - 1)) * (W - padX * 2)
    const y = H - padY - (vals[i] / max) * (H - padY * 2)
    return [x, y]
  })

  const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ')
  const area = line + ' L' + pts[pts.length - 1][0] + ',' + (H - padY) + ' L' + pts[0][0] + ',' + (H - padY) + ' Z'

  return (
    <svg width="100%" height="110" viewBox="0 0 340 110" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a1c2e" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7a1c2e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaGrad)" />
      <path d={line} fill="none" stroke="#7a1c2e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#7a1c2e">
          <title>
            {days[i]}: {fmtH(vals[i])}h
          </title>
        </circle>
      ))}
      <text x={pts[0][0]} y={H} fontSize="9" fill="#bbb" textAnchor="middle" fontFamily="'DM Sans',sans-serif">
        {days[0].slice(5)}
      </text>
      <text x={pts[pts.length - 1][0]} y={H} fontSize="9" fill="#bbb" textAnchor="end" fontFamily="'DM Sans',sans-serif">
        {days[days.length - 1].slice(5)}
      </text>
    </svg>
  )
}

export function AnalisisTab({ data }: AnalisisTabProps) {
  const rubroEntries = byKey(data, 'rubro')

  return (
    <div className="tab-content">
      <div className="section-title">Horas por rubro</div>
      <div className="card" style={{ padding: 18 }}>
        <div className="pie-wrap">
          <PieChart entries={rubroEntries} />
        </div>
        <div className="legend">
          {rubroEntries.map(([label, val], i) => (
            <div key={label} className="legend-item">
              <div className="legend-dot" style={{ background: getColor(i) }} />
              {label}: {fmtH(val)}h
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">Distribución por rubro</div>
      <div className="card" style={{ padding: 18 }}>
        <BarChart entries={rubroEntries} />
      </div>

      <div className="section-title">Horas por persona</div>
      <PersonAccordion data={data} />

      <div className="section-title">Evolución diaria</div>
      <div className="card" style={{ padding: '18px 18px 14px' }}>
        <div className="line-chart-wrap">
          <LineChart data={data} />
        </div>
      </div>
    </div>
  )
}
