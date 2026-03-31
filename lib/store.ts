'use client'

import { AppData, Record } from './types'

const LS_KEY = 'arq-tracker-v2'

const DEFAULT_DATA: AppData = {
  stages: ['Anteproyecto', 'Proyecto', 'Documentación', 'Dirección de Obra', 'Obra', 'Renderizado', 'Gestión'],
  rubros: ['Diseño', 'Reunión', 'Render', 'Dirección de Obra', 'Gestión'],
  people: ['Juan', 'María', 'Lucas', 'Sofía'],
  records: [],
}

export function loadData(): AppData {
  if (typeof window === 'undefined') return DEFAULT_DATA
  try {
    const stored = localStorage.getItem(LS_KEY)
    return stored ? JSON.parse(stored) : DEFAULT_DATA
  } catch {
    return DEFAULT_DATA
  }
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

export function addRecord(data: AppData, record: Omit<Record, 'id'>): AppData {
  const newRecord: Record = {
    ...record,
    id: Date.now().toString(),
  }
  const newData = {
    ...data,
    records: [...data.records, newRecord],
  }
  saveData(newData)
  return newData
}

export function deleteRecord(data: AppData, id: string): AppData {
  const newData = {
    ...data,
    records: data.records.filter((r) => r.id !== id),
  }
  saveData(newData)
  return newData
}

export function addRubro(data: AppData, rubro: string): AppData {
  if (data.rubros.includes(rubro)) return data
  const newData = {
    ...data,
    rubros: [...data.rubros, rubro],
  }
  saveData(newData)
  return newData
}

export function addPerson(data: AppData, person: string): AppData {
  if (data.people.includes(person)) return data
  const newData = {
    ...data,
    people: [...data.people, person],
  }
  saveData(newData)
  return newData
}

// Aggregation helpers
export function totalHours(data: AppData): number {
  return data.records.reduce((sum, r) => sum + r.hours, 0)
}

export function byKey(data: AppData, key: keyof Record): [string, number][] {
  const map: { [k: string]: number } = {}
  data.records.forEach((r) => {
    const k = r[key] as string
    map[k] = (map[k] || 0) + r.hours
  })
  return Object.entries(map).sort((a, b) => b[1] - a[1])
}

export interface PersonDetail {
  total: number
  rubros: { [rubro: string]: number }
}

export function byPersonDetail(data: AppData): [string, PersonDetail][] {
  const map: { [person: string]: PersonDetail } = {}
  data.records.forEach((r) => {
    if (!map[r.person]) map[r.person] = { total: 0, rubros: {} }
    map[r.person].total += r.hours
    map[r.person].rubros[r.rubro] = (map[r.person].rubros[r.rubro] || 0) + r.hours
  })
  return Object.entries(map).sort((a, b) => b[1].total - a[1].total)
}

// Color palette
const PALETTE = [
  '#7a1c2e',
  '#2c3e50',
  '#4a6fa5',
  '#6b8f71',
  '#b5838d',
  '#7d6b7d',
  '#c9a96e',
  '#5f7a8a',
  '#8b635a',
  '#4a7c59',
  '#3d5a80',
  '#a07855',
]
export function getColor(index: number): string {
  return PALETTE[index % PALETTE.length]
}

// Formatting helpers
export function fmtDate(d: string): string {
  return new Date(d + 'T12:00:00').toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function fmtDateShort(d: string): string {
  return d.slice(5)
}

export function fmtH(h: number): string {
  return Number.isInteger(h) ? h.toString() : h.toFixed(1)
}
