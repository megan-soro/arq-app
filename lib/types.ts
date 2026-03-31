export interface Record {
  id: string
  stage: string
  rubro: string
  person: string
  hours: number
  fecha: string
  notes: string
}

export interface AppData {
  stages: string[]
  rubros: string[]
  people: string[]
  records: Record[]
}
