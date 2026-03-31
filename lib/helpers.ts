import { Record } from './types'

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
