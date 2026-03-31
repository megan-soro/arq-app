'use client'

import { useState, useEffect } from 'react'
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
  loadData,
  addRecord,
  deleteRecord as deleteRecordStore,
  addRubro,
  addPerson,
  totalHours,
} from '@/lib/store'
import { AppData } from '@/lib/types'

type TabId = 'dashboard' | 'registros' | 'analisis' | 'resumen'

export default function Home() {
  const [data, setData] = useState<AppData | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setData(loadData())
  }, [])

  if (!data) {
    return null
  }

  const handleSaveRecord = (record: {
    stage: string
    rubro: string
    person: string
    hours: number
    date: string
    notes: string
  }) => {
    setData(addRecord(data, record))
    setModalOpen(false)
  }

  const handleDeleteRecord = (id: string) => {
    setData(deleteRecordStore(data, id))
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
