import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Tabs from './components/Tabs'
import VoiceTab from './components/VoiceTab'
import NutritionTab from './components/NutritionTab'
import EmergencyTab from './components/EmergencyTab'
import HealthTab from './components/HealthTab'
import ChatTab from './components/ChatTab'
import { useLanguage } from './hooks/useLanguage'

function AppContent() {
  const location = useLocation()
  const { currentLanguage, changeLanguage, t } = useLanguage()
  
  const getActiveTab = () => {
    const path = location.pathname
    if (path === '/voice') return 'voice'
    if (path === '/nutrition') return 'nutrition'
    if (path === '/emergency') return 'emergency'
    if (path === '/health') return 'health'
    if (path === '/chat') return 'chat'
    return 'voice'
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white min-h-screen shadow-xl border-x border-slate-200">
        <Header t={t} />
        <Tabs activeTab={getActiveTab()} t={t} />
        
        <div className="px-8 py-10">
          <div className="max-w-3xl mx-auto">
            <Routes>
              <Route path="/" element={
                <div className="card p-8">
                  <VoiceTab 
                    currentLanguage={currentLanguage} 
                    changeLanguage={changeLanguage} 
                    t={t} 
                  />
                </div>
              } />
              <Route path="/voice" element={
                <div className="card p-8">
                  <VoiceTab 
                    currentLanguage={currentLanguage} 
                    changeLanguage={changeLanguage} 
                    t={t} 
                  />
                </div>
              } />
              <Route path="/nutrition" element={
                <div className="card p-8">
                  <NutritionTab t={t} currentLanguage={currentLanguage} />
                </div>
              } />
              <Route path="/emergency" element={
                <div className="card p-8">
                  <EmergencyTab t={t} currentLanguage={currentLanguage} />
                </div>
              } />
              <Route path="/health" element={
                <div className="card p-8">
                  <HealthTab t={t} />
                </div>
              } />
              <Route path="/chat" element={
                <div className="card p-8">
                  <ChatTab t={t} currentLanguage={currentLanguage} />
                </div>
              } />
            </Routes>
          </div>
        </div>
        
        <footer className="bg-slate-50 border-t border-slate-200 py-6 px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-slate-600 text-sm">
              {t.footer}
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App