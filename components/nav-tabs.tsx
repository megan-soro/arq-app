'use client'

type TabId = 'dashboard' | 'registros' | 'analisis' | 'resumen'

interface NavTabsProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Inicio' },
  { id: 'registros', label: 'Registros' },
  { id: 'analisis', label: 'Análisis' },
  { id: 'resumen', label: 'Resumen' },
]

export function NavTabs({ activeTab, onTabChange }: NavTabsProps) {
  return (
    <div className="nav-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
