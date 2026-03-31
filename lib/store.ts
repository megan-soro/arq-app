'use client'

import { useEffect, useState } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { createClient } from './supabase/client'
import { AppData, Record } from './types'

const DEFAULT_DATA: AppData = {
  stages: ['Anteproyecto', 'Proyecto', 'Documentación', 'Dirección de Obra', 'Obra', 'Renderizado', 'Gestión'],
  rubros: ['Diseño', 'Reunión', 'Render', 'Dirección de Obra', 'Gestión'],
  people: ['Juan', 'María', 'Lucas', 'Sofía'],
  records: [],
}

let channel: RealtimeChannel | null = null

export async function loadData(): Promise<AppData> {
  const supabase = createClient()
  try {
    const { data: records, error } = await supabase
      .from('registros')
      .select('*')
      .order('fecha', { ascending: false })

    if (error) throw error
    return {
      ...DEFAULT_DATA,
      records: (records || []) as Record[],
    }
  } catch (err) {
    console.error('[v0] Error loading data:', err)
    return DEFAULT_DATA
  }
}

export async function saveData(): Promise<void> {
  // Datos guardados directamente en Supabase
}

export async function addRecord(
  data: AppData,
  record: Omit<Record, 'id'>
): Promise<Record | null> {
  const supabase = createClient()
  try {
    const { data: inserted, error } = await supabase
      .from('registros')
      .insert({
        fecha: record.fecha,
        hours: record.hours,
        rubro: record.rubro,
        person: record.person,
        stage: record.stage,
        notes: record.notes,
      })
      .select()
      .single()

    if (error) throw error
    return inserted as Record
  } catch (err) {
    console.error('[v0] Error adding record:', err)
    return null
  }
}

export async function deleteRecord(id: string): Promise<boolean> {
  const supabase = createClient()
  try {
    const { error } = await supabase.from('registros').delete().eq('id', id)
    if (error) throw error
    return true
  } catch (err) {
    console.error('[v0] Error deleting record:', err)
    return false
  }
}

export function addRubro(data: AppData, rubro: string): AppData {
  if (data.rubros.includes(rubro)) return data
  return {
    ...data,
    rubros: [...data.rubros, rubro],
  }
}

export function addPerson(data: AppData, person: string): AppData {
  if (data.people.includes(person)) return data
  return {
    ...data,
    people: [...data.people, person],
  }
}

export function useData() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const loaded = await loadData()
      if (isMounted) setData(loaded)

      // Setup real-time listener
      const supabase = createClient()
      if (!channel) {
        channel = supabase
          .channel('registros-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'registros',
            },
            async () => {
              const updated = await loadData()
              if (isMounted) setData(updated)
            }
          )
          .subscribe()
      }

      if (isMounted) setLoading(false)
    }

    init()

    return () => {
      isMounted = false
    }
  }, [])

  return { data, loading }
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

export function groupByDate(records: Record[]): { [date: string]: Record[] } {
  const grouped: { [date: string]: Record[] } = {}
  records.forEach((r) => {
    grouped[r.fecha] = grouped[r.fecha] || []
    grouped[r.fecha].push(r)
  })
  return grouped
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
