import { Link } from 'react-router-dom'

const Tabs = ({ activeTab, t }) => {
  const tabs = [
    { id: 'voice', label: t.tabVoice, icon: '🎤', path: '/voice' },
    { id: 'nutrition', label: t.tabNutrition, icon: '🥗', path: '/nutrition' },
    { id: 'emergency', label: t.tabEmergency, icon: '🚨', path: '/emergency' },
    { id: 'health', label: t.tabHealth, icon: '💊', path: '/health' },
    { id: 'chat', label: t.tabChat, icon: '💬', path: '/chat' },
    { id: 'insights', label: t.tabInsights, icon: '📊', path: '/insights' },
  ]

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex-1 min-w-0 px-6 py-4 text-center cursor-pointer border-b-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap group no-underline ${
                activeTab === tab.id
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className={`text-lg transition-transform duration-200 ${
                  activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  {tab.icon}
                </span>
                <span className="font-medium">{tab.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tabs