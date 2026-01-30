import { useState, useEffect } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import VoiceTab from './components/VoiceTab'
import NutritionTab from './components/NutritionTab'
import EmergencyTab from './components/EmergencyTab'
import HealthTab from './components/HealthTab'
import ChatTab from './components/ChatTab'
import { useLanguage } from './hooks/useLanguage'

function App() {
  const [activeTab, setActiveTab] = useState('voice')
  const { currentLanguage, changeLanguage, t } = useLanguage()

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white min-h-screen shadow-xl border-x border-slate-200">
        <Header t={t} />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
        
        <div className="px-8 py-10">
          <div className="max-w-3xl mx-auto">
            {activeTab === 'voice' && (
              <div className="card p-8">
                <VoiceTab 
                  currentLanguage={currentLanguage} 
                  changeLanguage={changeLanguage} 
                  t={t} 
                />
              </div>
            )}
            {activeTab === 'nutrition' && (
              <div className="card p-8">
                <NutritionTab t={t} />
              </div>
            )}
            {activeTab === 'emergency' && (
              <div className="card p-8">
                <EmergencyTab t={t} currentLanguage={currentLanguage} />
              </div>
            )}
            {activeTab === 'health' && (
              <div className="card p-8">
                <HealthTab t={t} />
              </div>
            )}
            {activeTab === 'chat' && (
              <div className="card p-8">
                <ChatTab t={t} currentLanguage={currentLanguage} />
              </div>
            )}
          </div>
        </div>
        
        <footer className="bg-slate-50 border-t border-slate-200 py-6 px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-slate-600 text-sm">
              © 2024 ग्रामीण स्वास्थ्य प्लेटफॉर्म | आपातकाल के लिए: 108
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App