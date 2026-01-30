import { useState } from 'react'
import { getHealthAdvice } from '../services/geminiService'

const VoiceTab = ({ currentLanguage, changeLanguage, t }) => {
  const [isListening, setIsListening] = useState(false)
  const [result, setResult] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const languages = [
    { value: 'hi', label: '🇮🇳 हिंदी (Hindi)' },
    { value: 'en', label: '🇺🇸 English' },
    { value: 'bn', label: '🇧🇩 বাংলা (Bengali)' },
    { value: 'te', label: '🇮🇳 తెలుగు (Telugu)' },
  ]

  const getLocalizedContent = () => {
    const content = {
      hi: {
        subtitle: "अपनी स्वास्थ्य समस्या बताएं और तुरंत सलाह पाएं",
        selectLanguage: "भाषा चुनें / Select Language",
        usageTips: "उपयोग के सुझाव:",
        tip1: "• माइक्रोफोन बटन दबाएं और अपनी समस्या बताएं",
        tip2: "• \"मुझे बुखार है\" या \"सिरदर्द है\" जैसे वाक्य बोलें",
        tip3: "• यदि आवाज़ काम नहीं कर रही तो बटन फिर से दबाएं"
      },
      en: {
        subtitle: "Describe your health problem and get instant advice",
        selectLanguage: "Select Language / भाषा चुनें",
        usageTips: "Usage Tips:",
        tip1: "• Press the microphone button and describe your problem",
        tip2: "• Say phrases like \"I have fever\" or \"I have headache\"",
        tip3: "• If voice is not working, press the button again"
      },
      bn: {
        subtitle: "আপনার স্বাস্থ্য সমস্যা বর্ণনা করুন এবং তাৎক্ষণিক পরামর্শ পান",
        selectLanguage: "ভাষা নির্বাচন করুন / Select Language",
        usageTips: "ব্যবহারের টিপস:",
        tip1: "• মাইক্রোফোন বোতাম চাপুন এবং আপনার সমস্যা বর্ণনা করুন",
        tip2: "• \"আমার জ্বর হয়েছে\" বা \"মাথাব্যথা হচ্ছে\" এর মতো বাক্য বলুন",
        tip3: "• যদি ভয়েস কাজ না করে তবে বোতামটি আবার চাপুন"
      },
      te: {
        subtitle: "మీ ఆరోగ్య సమస్యను వివరించండి మరియు తక్షణ సలహా పొందండి",
        selectLanguage: "భాష ఎంచుకోండి / Select Language",
        usageTips: "వాడుక చిట్కాలు:",
        tip1: "• మైక్రోఫోన్ బటన్ నొక్కి మీ సమస్యను వివరించండి",
        tip2: "• \"నాకు జ్వరం వచ్చింది\" లేదా \"తలనొప్పి వస్తోంది\" వంటి వాక్యాలు చెప్పండి",
        tip3: "• వాయిస్ పని చేయకపోతే బటన్‌ను మళ్లీ నొక్కండి"
      }
    }
    return content[currentLanguage] || content.hi
  }

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.lang = getLanguageCode(currentLanguage)
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      
      setIsListening(true)
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        processHealthQuery(transcript)
        setIsListening(false)
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        simulateVoiceRecognition()
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      recognitionInstance.start()
      setRecognition(recognitionInstance)
    } else {
      simulateVoiceRecognition()
    }
  }

  const simulateVoiceRecognition = () => {
    setIsListening(true)
    
    setTimeout(() => {
      setIsListening(false)
      const sampleQueries = {
        hi: "मुझे बुखार है",
        en: "I have fever",
        bn: "আমার জ্বর হয়েছে",
        te: "నాకు జ్వరం వచ్చింది"
      }
      const query = sampleQueries[currentLanguage] || sampleQueries.hi
      processHealthQuery(query)
    }, 2000)
  }

  const getLanguageCode = (lang) => {
    const langCodes = {
      hi: 'hi-IN',
      en: 'en-US',
      bn: 'bn-IN',
      te: 'te-IN'
    }
    return langCodes[lang] || 'hi-IN'
  }

  const processHealthQuery = async (query) => {
    setIsLoading(true)
    
    try {
      const response = await getHealthAdvice(query, currentLanguage)
      
      // Remove asterisks from response
      const cleanResponse = response.replace(/\*/g, '')
      
      const questionLabels = {
        hi: "आपका सवाल:",
        en: "Your Question:",
        bn: "আপনার প্রশ্ন:",
        te: "మీ ప్రశ్న:"
      }

      const suggestionLabels = {
        hi: "सुझाव:",
        en: "Suggestion:",
        bn: "পরামর্শ:",
        te: "సూచన:"
      }

      const questionLabel = questionLabels[currentLanguage] || questionLabels.hi
      const suggestionLabel = suggestionLabels[currentLanguage] || suggestionLabels.hi

      setResult(`${questionLabel} ${query}\n\n${suggestionLabel} ${cleanResponse}`)
      setShowResult(true)
    } catch (error) {
      console.error('Error getting health advice:', error)
      // Fallback to original logic if API fails
      processHealthQueryFallback(query)
    } finally {
      setIsLoading(false)
    }
  }

  const processHealthQueryFallback = (query) => {
    const healthResponses = {
      hi: {
        fever: "आराम करें, पानी पिएं। अगर 3 दिन से ज्यादा बुखार हो तो डॉक्टर से मिलें।",
        cough: "गर्म पानी पिएं, शहद लें। 2 सप्ताह से ज्यादा खांसी हो तो जांच कराएं।",
        headache: "आराम करें, पानी पिएं। तेज दर्द हो तो तुरंत डॉक्टर से मिलें।",
        stomach: "हल्का खाना खाएं, पानी पिएं। दर्द बढ़े तो डॉक्टर से मिलें।",
        default: "कृपया अपने लक्षणों के बारे में और बताएं।"
      },
      en: {
        fever: "Rest and drink fluids. See doctor if fever persists over 3 days.",
        cough: "Drink warm water, take honey. Get checked if cough persists over 2 weeks.",
        headache: "Rest and hydrate. See doctor immediately for severe pain.",
        stomach: "Eat light food, drink water. See doctor if pain increases.",
        default: "Please describe your symptoms in more detail."
      },
      bn: {
        fever: "বিশ্রাম নিন, তরল পান করুন। ৩ দিনের বেশি জ্বর হলে ডাক্তার দেখান।",
        cough: "গরম পানি পান করুন, মধু নিন। ২ সপ্তাহের বেশি কাশি হলে পরীক্ষা করান।",
        headache: "বিশ্রাম নিন, পানি পান করুন। তীব্র ব্যথা হলে তৎক্ষণাৎ ডাক্তার দেখান।",
        stomach: "হালকা খাবার খান, পানি পান করুন। ব্যথা বাড়লে ডাক্তার দেখান।",
        default: "অনুগ্রহ করে আপনার লক্ষণগুলি আরও বিস্তারিত বলুন।"
      },
      te: {
        fever: "విశ్రాంతి తీసుకోండి, నీరు త్రాగండి। 3 రోజులకు మించి జ్వరం ఉంటే వైద్యుడిని కలవండి।",
        cough: "వేడిమి నీరు త్రాగండి, తేనె తీసుకోండి। 2 వారాలకు మించి దగ్గు ఉంటే పరీక్షించండి।",
        headache: "విశ్రాంతి తీసుకోండి, నీరు త్రాగండి। తీవ్రమైన నొప్పి ఉంటే వెంటనే వైద్యుడిని కలవండి।",
        stomach: "తేలికపాటి ఆహారం తీసుకోండి, నీరు త్రాగండి। నొప్పి పెరిగితే వైద్యుడిని కలవండి।",
        default: "దయచేసి మీ లక్షణాలను మరింత వివరంగా చెప్పండి।"
      }
    }

    const responses = healthResponses[currentLanguage] || healthResponses.hi
    const lowerQuery = query.toLowerCase()
    let response = responses.default

    if (lowerQuery.includes('बुखार') || lowerQuery.includes('fever') || 
        lowerQuery.includes('জ্বর') || lowerQuery.includes('జ్వరం')) {
      response = responses.fever
    } else if (lowerQuery.includes('खांसी') || lowerQuery.includes('cough') || 
               lowerQuery.includes('কাশি') || lowerQuery.includes('దగ్గు')) {
      response = responses.cough
    } else if (lowerQuery.includes('सिरदर्द') || lowerQuery.includes('headache') || 
               lowerQuery.includes('মাথাব্যথা') || lowerQuery.includes('తలనొప్పి')) {
      response = responses.headache
    } else if (lowerQuery.includes('पेट') || lowerQuery.includes('stomach') || 
               lowerQuery.includes('পেট') || lowerQuery.includes('కడుపు')) {
      response = responses.stomach
    }

    const questionLabels = {
      hi: "आपका सवाल:",
      en: "Your Question:",
      bn: "আপনার প্রশ্ন:",
      te: "మీ ప్రశ్న:"
    }

    const suggestionLabels = {
      hi: "सुझाव:",
      en: "Suggestion:",
      bn: "পরামর্শ:",
      te: "సూచన:"
    }

    const questionLabel = questionLabels[currentLanguage] || questionLabels.hi
    const suggestionLabel = suggestionLabels[currentLanguage] || suggestionLabels.hi

    setResult(`${questionLabel} ${query}\n\n${suggestionLabel} ${response}`)
    setShowResult(true)
  }

  const speakResult = () => {
    if ('speechSynthesis' in window && result) {
      const utterance = new SpeechSynthesisUtterance(result.split('\n\n')[1].replace('सुझाव: ', '').replace('Suggestion: ', '').replace('পরামর্শ: ', '').replace('సూచన: ', ''))
      utterance.lang = getLanguageCode(currentLanguage)
      speechSynthesis.speak(utterance)
    }
  }

  const localContent = getLocalizedContent()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <span className="text-2xl">🎤</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.voiceTitle}</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          {localContent.subtitle}
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {localContent.selectLanguage}
        </label>
        <select
          value={currentLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          className="input-field text-base font-medium"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center py-8">
        <button
          onClick={startVoiceRecognition}
          disabled={isListening || isLoading}
          className={`w-48 h-48 rounded-full text-white border-0 text-xl font-bold cursor-pointer mx-auto block shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
            isListening || isLoading
              ? 'bg-blue-600 cursor-not-allowed scale-110 shadow-lg'
              : 'bg-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-2xl active:scale-95'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-4xl">{isLoading ? '⏳' : isListening ? '🔊' : '🎤'}</span>
            <span className="text-lg font-bold">
              {isLoading ? 'विश्लेषण...' : isListening ? t.listening : t.speakButton}
            </span>
          </div>
        </button>
      </div>

      {showResult && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">ℹ️</span>
              </div>
              <div className="flex-1">
                <div className="whitespace-pre-line text-gray-800 leading-relaxed">{result}</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={speakResult}
            className="btn-primary w-full py-4 text-lg font-semibold"
          >
            🔊 {t.listenText}
          </button>
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">💡</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-indigo-900 mb-2">{localContent.usageTips}</h3>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>{localContent.tip1}</li>
              <li>{localContent.tip2}</li>
              <li>{localContent.tip3}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceTab