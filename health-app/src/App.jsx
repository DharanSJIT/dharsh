import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Tabs from './components/Tabs'
import VoiceTab from './components/VoiceTab'
import NutritionTab from './components/NutritionTab'
import EmergencyTab from './components/EmergencyTab'
import HealthTab from './components/HealthTab'
import ChatTab from './components/ChatTab'
import InsightsTab from './components/InsightsTab'
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
    if (path === '/insights') return 'insights'
    return 'voice'
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white min-h-screen shadow-2xl">
        <Header t={t} currentLanguage={currentLanguage} />
        <div className="pt-24">
          <Tabs activeTab={getActiveTab()} t={t} />
        </div>
        
        <div className="px-6 py-8 md:px-12 md:py-10">
          <div className="max-w-4xl mx-auto">
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
              <Route path="/insights" element={
                <div className="card p-8">
                  <InsightsTab t={t} currentLanguage={currentLanguage} />
                </div>
              } />
            </Routes>
          </div>
        </div>
        
        <footer className="bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-700 font-semibold">{t.appTitle}</p>
                  <p className="text-slate-500 text-xs">{t.appSubtitle}</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-slate-600 text-sm font-medium">
                  {t.footer}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {currentLanguage === 'hi' ? 'स्वस्थ भारत, सशक्त भारत' : 'Healthy India, Strong India'}
                </p>
              </div>
            </div>
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