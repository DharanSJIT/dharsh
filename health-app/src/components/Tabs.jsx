const Tabs = ({ activeTab, setActiveTab, t }) => {
  const tabs = [
    { id: 'voice', label: t.tabVoice, icon: '🎤' },
    { id: 'nutrition', label: t.tabNutrition, icon: '🥗' },
    { id: 'emergency', label: t.tabEmergency, icon: '🚨' },
    { id: 'health', label: t.tabHealth, icon: '💊' },
    { id: 'chat', label: t.tabChat, icon: '💬' },
  ]

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-0 px-6 py-4 text-center cursor-pointer border-b-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap group ${
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
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tabs