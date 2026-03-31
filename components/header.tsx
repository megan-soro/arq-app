'use client'

import { fmtH } from '@/lib/store'

interface HeaderProps {
  totalHours: number
}

export function Header({ totalHours }: HeaderProps) {
  return (
    <div className="header">
      <div className="header-top">
        <div>
          <div className="header-label">Arévalo 1643</div>
          <div className="header-title">Registro de Tiempo</div>
        </div>
        <div className="total-badge">
          {fmtH(totalHours)} <span>h</span>
        </div>
      </div>
    </div>
  )
}
