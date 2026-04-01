'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { NavTabs } from '@/components/nav-tabs'
import { BottomNav } from '@/components/bottom-nav'
import { Fab } from '@/components/fab'
import { RecordModal } from '@/components/record-modal'
import { DashboardTab } from '@/components/tabs/dashboard-tab'
import { RegistrosTab } from '@/components/tabs/registros-tab'
import { AnalisisTab } from '@/components/tabs/analisis-tab'
import { ResumenTab } from '@/components/tabs/resumen-tab'
import {
  useData,
  addRecord,
  deleteRecord as deleteRecordStore,
  addRubro,
  addPerson,
  totalHours,
} from '@/lib/store'
import { AppData, Record } from '@/lib/types'

type TabId = 'dashboard' | 'registros' | 'analisis' | 'resumen'

export default function Home() {
  const { data: initialData, loading } = useData()
  const [data, setData] = useState<AppData | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [modalOpen, setModalOpen] = useState(false)

  // Update data when initialData loads
  if (data === null && initialData) {
    setData(initialData)
  }

  if (!data || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-current mb-2"></div>
          <p className="text-sm">Cargando...</p>
        </div>
      </div>
    )
  }

  const handleSaveRecord = async (record: {
    stage: string
    rubro: string
    person: string
    hours: number
    date: string
    notes: string
  }) => {
    const newRecord = await addRecord(data, {
      ...record,
      fecha: record.date,
    })
    if (newRecord) {
      const updatedData = {
        ...data,
        records: [newRecord, ...data.records],
      }
      setData(updatedData)
      setModalOpen(false)
    }
  }

  const handleDeleteRecord = async (id: string) => {
    const success = await deleteRecordStore(id)
    if (success) {
      const updatedData = {
        ...data,
        records: data.records.filter((r) => r.id !== id),
      }
      setData(updatedData)
    }
  }

  const handleAddRubro = (rubro: string) => {
    setData(addRubro(data, rubro))
  }

  const handleAddPerson = (person: string) => {
    setData(addPerson(data, person))
  }

  return (
    <>
      <Header totalHours={totalHours(data)} />
      <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="main">
        {activeTab === 'dashboard' && <DashboardTab data={data} />}
        {activeTab === 'registros' && <RegistrosTab data={data} onDelete={handleDeleteRecord} />}
        {activeTab === 'analisis' && <AnalisisTab data={data} />}
        {activeTab === 'resumen' && <ResumenTab data={data} />}
      </div>

      <Fab onClick={() => setModalOpen(true)} />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <RecordModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
        onSave={handleSaveRecord}
        onAddRubro={handleAddRubro}
        onAddPerson={handleAddPerson}
      />
    </>
  )
}
