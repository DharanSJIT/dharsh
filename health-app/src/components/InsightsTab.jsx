import { useState, useEffect } from 'react'

const InsightsTab = ({ t, currentLanguage }) => {
  const [healthScore, setHealthScore] = useState(85)
  const [riskLevel, setRiskLevel] = useState('low')
  const [symptoms, setSymptoms] = useState([])

  useEffect(() => {
    // Load symptoms from localStorage
    const savedSymptoms = JSON.parse(localStorage.getItem('symptomHistory') || '[]')
    setSymptoms(savedSymptoms)
    calculateHealthScore(savedSymptoms)
  }, [])

  const calculateHealthScore = (symptomList) => {
    if (symptomList.length === 0) {
      setHealthScore(100)
      setRiskLevel('low')
      return
    }

    const recentSymptoms = symptomList.slice(-7) // Last 7 entries
    const score = Math.max(40, 100 - (recentSymptoms.length * 10))
    setHealthScore(score)

    if (score >= 80) setRiskLevel('low')
    else if (score >= 60) setRiskLevel('medium')
    else setRiskLevel('high')
  }

  const addSymptom = (symptom, severity) => {
    const newSymptom = {
      symptom,
      severity,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    }
    const updated = [...symptoms, newSymptom]
    setSymptoms(updated)
    localStorage.setItem('symptomHistory', JSON.stringify(updated))
    calculateHealthScore(updated)
  }

  const getContent = () => {
    const content = {
      hi: {
        title: "स्वास्थ्य अंतर्दृष्टि",
        healthScore: "स्वास्थ्य स्कोर",
        riskLevel: "जोखिम स्तर",
        low: "कम",
        medium: "मध्यम",
        high: "उच्च",
        symptomTracker: "लक्षण ट्रैकर",
        addSymptom: "लक्षण जोड़ें",
        symptomHistory: "लक्षण इतिहास",
        noSymptoms: "कोई लक्षण दर्ज नहीं",
        severity: "गंभीरता",
        mild: "हल्का",
        moderate: "मध्यम",
        severe: "गंभीर",
        recommendations: "सिफारिशें",
        goodHealth: "आपका स्वास्थ्य अच्छा है! स्वस्थ आदतें बनाए रखें।",
        moderateRisk: "कुछ स्वास्थ्य चिंताएं हैं। स्वास्थ्य कर्मी से परामर्श लें।",
        highRisk: "तुरंत चिकित्सा ध्यान की आवश्यकता है। 108 पर कॉल करें।"
      },
      en: {
        title: "Health Insights",
        healthScore: "Health Score",
        riskLevel: "Risk Level",
        low: "Low",
        medium: "Medium",
        high: "High",
        symptomTracker: "Symptom Tracker",
        addSymptom: "Add Symptom",
        symptomHistory: "Symptom History",
        noSymptoms: "No symptoms recorded",
        severity: "Severity",
        mild: "Mild",
        moderate: "Moderate",
        severe: "Severe",
        recommendations: "Recommendations",
        goodHealth: "Your health is good! Keep maintaining healthy habits.",
        moderateRisk: "Some health concerns detected. Consult a health worker.",
        highRisk: "Immediate medical attention needed. Call 108."
      }
    }
    return content[currentLanguage] || content.hi
  }

  const content = getContent()

  const getRiskColor = () => {
    if (riskLevel === 'low') return 'bg-green-500'
    if (riskLevel === 'medium') return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getRiskText = () => {
    if (riskLevel === 'low') return content.low
    if (riskLevel === 'medium') return content.medium
    return content.high
  }

  const getRecommendation = () => {
    if (riskLevel === 'low') return content.goodHealth
    if (riskLevel === 'medium') return content.moderateRisk
    return content.highRisk
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>

      {/* Visual Health Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">{content.healthScore}</p>
            <p className="text-5xl font-bold">{healthScore}</p>
          </div>
          <div className="text-6xl">💚</div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">{content.riskLevel}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskColor()} text-white`}>
              {getRiskText()}
            </span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getRiskColor()}`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">{content.recommendations}</h3>
        <p className="text-blue-800 text-sm">{getRecommendation()}</p>
      </div>

      {/* Quick Symptom Buttons */}
      <div>
        <h3 className="font-semibold mb-3">{content.symptomTracker}</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Fever', 'Cough', 'Headache', 'Stomach Pain'].map((symptom) => (
            <button
              key={symptom}
              onClick={() => addSymptom(symptom, 'mild')}
              className="p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-sm font-medium"
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Symptom History */}
      <div>
        <h3 className="font-semibold mb-3">{content.symptomHistory}</h3>
        {symptoms.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{content.noSymptoms}</p>
        ) : (
          <div className="space-y-2">
            {symptoms.slice(-5).reverse().map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.symptom}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.severity === 'mild' ? 'bg-yellow-100 text-yellow-800' :
                  item.severity === 'moderate' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InsightsTab
