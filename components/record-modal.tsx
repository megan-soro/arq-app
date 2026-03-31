'use client'

import { useState, useEffect } from 'react'
import { AppData } from '@/lib/types'

interface RecordModalProps {
  open: boolean
  onClose: () => void
  data: AppData
  onSave: (record: { stage: string; rubro: string; person: string; hours: number; date: string; notes: string }) => void
  onAddRubro: (rubro: string) => void
  onAddPerson: (person: string) => void
}

export function RecordModal({ open, onClose, data, onSave, onAddRubro, onAddPerson }: RecordModalProps) {
  const [stage, setStage] = useState('')
  const [rubro, setRubro] = useState('')
  const [person, setPerson] = useState('')
  const [hours, setHours] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')

  const [showNewRubro, setShowNewRubro] = useState(false)
  const [newRubroInput, setNewRubroInput] = useState('')

  const [showNewPerson, setShowNewPerson] = useState(false)
  const [newPersonInput, setNewPersonInput] = useState('')

  useEffect(() => {
    if (open) {
      setStage('')
      setRubro('')
      setPerson('')
      setHours('')
      setDate(new Date().toISOString().slice(0, 10))
      setNotes('')
      setShowNewRubro(false)
      setNewRubroInput('')
      setShowNewPerson(false)
      setNewPersonInput('')
    }
  }, [open])

  const isValid = stage && rubro && person && parseFloat(hours) > 0 && date

  const handleSave = () => {
    if (!isValid) return
    onSave({
      stage,
      rubro,
      person,
      hours: parseFloat(hours),
      date,
      notes: notes.trim(),
    })
  }

  const handleSaveNewRubro = () => {
    const val = newRubroInput.trim()
    if (!val) return
    onAddRubro(val)
    setRubro(val)
    setShowNewRubro(false)
    setNewRubroInput('')
  }

  const handleSaveNewPerson = () => {
    const val = newPersonInput.trim()
    if (!val) return
    onAddPerson(val)
    setPerson(val)
    setShowNewPerson(false)
    setNewPersonInput('')
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!open) return null

  return (
    <div className={`modal-overlay ${open ? 'open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal-sheet">
        <div className="modal-header">
          <div className="modal-title">Nuevo registro</div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* ETAPA */}
        <div className="form-group">
          <label>Etapa</label>
          <div className="input-wrap">
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="" disabled>
                — Seleccionar etapa —
              </option>
              {data.stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="select-arrow">▼</span>
          </div>
        </div>

        {/* RUBRO */}
        <div className="form-group">
          <label>Rubro / Rol</label>
          {!showNewRubro ? (
            <div className="form-row">
              <div className="input-wrap" style={{ flex: 1 }}>
                <select value={rubro} onChange={(e) => setRubro(e.target.value)}>
                  <option value="" disabled>
                    — Seleccionar rubro —
                  </option>
                  {data.rubros.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
              <button className="add-inline-btn" onClick={() => setShowNewRubro(true)} title="Nuevo rubro">
                +
              </button>
            </div>
          ) : (
            <div className="new-field-wrap">
              <input
                type="text"
                value={newRubroInput}
                onChange={(e) => setNewRubroInput(e.target.value)}
                placeholder="Ej: Carpintería, Instalaciones…"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveNewRubro()}
                autoFocus
              />
              <button className="btn-ok" onClick={handleSaveNewRubro}>
                OK
              </button>
              <button
                className="btn-cancel-sm"
                onClick={() => {
                  setShowNewRubro(false)
                  setNewRubroInput('')
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* PERSONA */}
        <div className="form-group">
          <label>Persona</label>
          {!showNewPerson ? (
            <div className="form-row">
              <div className="input-wrap" style={{ flex: 1 }}>
                <select value={person} onChange={(e) => setPerson(e.target.value)}>
                  <option value="" disabled>
                    — Seleccionar persona —
                  </option>
                  {data.people.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
              <button className="add-inline-btn" onClick={() => setShowNewPerson(true)} title="Nueva persona">
                +
              </button>
            </div>
          ) : (
            <div className="new-field-wrap">
              <input
                type="text"
                value={newPersonInput}
                onChange={(e) => setNewPersonInput(e.target.value)}
                placeholder="Nombre de la persona"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveNewPerson()}
                autoFocus
              />
              <button className="btn-ok" onClick={handleSaveNewPerson}>
                OK
              </button>
              <button
                className="btn-cancel-sm"
                onClick={() => {
                  setShowNewPerson(false)
                  setNewPersonInput('')
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* HORAS + FECHA */}
        <div className="form-group">
          <div className="form-row">
            <div style={{ flex: 1 }}>
              <label>Horas</label>
              <input
                type="number"
                placeholder="Ej: 2.5"
                min={0.25}
                max={24}
                step={0.25}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div style={{ flex: 1.2 }}>
              <label>Fecha</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </div>

        {/* NOTAS */}
        <div className="form-group">
          <label>
            Notas <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
          </label>
          <textarea
            placeholder="Breve descripción de la tarea…"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button className="btn-save" disabled={!isValid} onClick={handleSave}>
          Guardar registro
        </button>
      </div>
    </div>
  )
}
