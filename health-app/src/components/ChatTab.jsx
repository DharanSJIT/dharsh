import { useState, useEffect, useRef } from 'react'

const ChatTab = ({ t, currentLanguage }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const chatContainerRef = useRef(null)

  useEffect(() => {
    addMessage(t.greeting, 'bot')
  }, [])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const addMessage = (message, sender) => {
    setMessages(prev => [...prev, { message, sender, id: Date.now() }])
  }

  const generateBotResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    const healthResponses = {
      hi: {
        fever: "बुखार के लिए आराम करें, पानी पिएं। 3 दिन से ज्यादा हो तो डॉक्टर से मिलें।",
        cough: "खांसी के लिए गर्म पानी और शहद लें। लगातार खांसी हो तो जांच कराएं।",
        headache: "सिरदर्द के लिए आराम करें। तेज दर्द हो तो तुरंत डॉक्टर से मिलें।",
        stomach: "पेट दर्द के लिए हल्का खाना खाएं। दर्द बढ़े तो डॉक्टर से मिलें।",
        medicine: "दवा के लिए Health टैब में जाकर अपनी दवाएं जोड़ें और रिमाइंडर सेट करें।",
        nutrition: "पोषण के लिए Nutrition टैब में जाकर अपने बजट के अनुसार भोजन योजना बनाएं।",
        emergency: "आपातकाल में Emergency टैब का उपयोग करें या तुरंत 108 पर कॉल करें।",
        hello: "नमस्ते! मैं आपका स्वास्थ्य सहायक हूं। आप अपनी समस्या बता सकते हैं।",
        thanks: "धन्यवाद! स्वस्थ रहें और जरूरत पड़ने पर संपर्क करें।",
        default: "मैं आपकी स्वास्थ्य संबंधी मदद कर सकता हूं। कृपया अपनी समस्या बताएं।"
      },
      en: {
        fever: "For fever, rest and drink fluids. See doctor if fever persists over 3 days.",
        cough: "For cough, drink warm water and honey. Get checked if cough persists.",
        headache: "For headache, rest and relax. See doctor immediately for severe pain.",
        stomach: "For stomach pain, eat light food. See doctor if pain increases.",
        medicine: "For medicines, go to Health tab to add your medications and set reminders.",
        nutrition: "For nutrition, go to Nutrition tab to create meal plans based on your budget.",
        emergency: "In emergency, use Emergency tab or call 108 immediately.",
        hello: "Hello! I am your health assistant. You can tell me your problems.",
        thanks: "Thank you! Stay healthy and contact when needed.",
        default: "I can help with your health concerns. Please describe your problem."
      }
    }

    const responses = healthResponses[currentLanguage] || healthResponses.hi

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
        lowerMessage.includes('नमस्ते') || lowerMessage.includes('हैलो')) {
      return responses.hello
    }
    // Thanks
    else if (lowerMessage.includes('thank') || lowerMessage.includes('धन्यवाद') || 
             lowerMessage.includes('शुक्रिया')) {
      return responses.thanks
    }
    // Health symptoms
    else if (lowerMessage.includes('बुखार') || lowerMessage.includes('fever')) {
      return responses.fever
    } else if (lowerMessage.includes('खांसी') || lowerMessage.includes('cough')) {
      return responses.cough
    } else if (lowerMessage.includes('सिरदर्द') || lowerMessage.includes('headache') ||
               lowerMessage.includes('सिर') || lowerMessage.includes('head')) {
      return responses.headache
    } else if (lowerMessage.includes('पेट') || lowerMessage.includes('stomach') ||
               lowerMessage.includes('पेट दर्द')) {
      return responses.stomach
    }
    // App features
    else if (lowerMessage.includes('दवा') || lowerMessage.includes('medicine') ||
             lowerMessage.includes('दवाई')) {
      return responses.medicine
    } else if (lowerMessage.includes('खाना') || lowerMessage.includes('nutrition') ||
               lowerMessage.includes('भोजन') || lowerMessage.includes('आहार')) {
      return responses.nutrition
    } else if (lowerMessage.includes('आपातकाल') || lowerMessage.includes('emergency') ||
               lowerMessage.includes('इमरजेंसी')) {
      return responses.emergency
    } else {
      return responses.default
    }
  }

  const sendMessage = () => {
    if (inputMessage.trim()) {
      addMessage(inputMessage, 'user')
      const userMessage = inputMessage
      setInputMessage('')
      
      setTimeout(() => {
        const response = generateBotResponse(userMessage)
        addMessage(response, 'bot')
      }, 1000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setTimeout(() => {
      addMessage(t.greeting, 'bot')
    }, 100)
  }

  const quickQuestions = {
    hi: [
      "मुझे बुखार है",
      "सिरदर्द हो रहा है", 
      "खांसी आ रही है",
      "पेट में दर्द है"
    ],
    en: [
      "I have fever",
      "I have headache",
      "I have cough", 
      "I have stomach pain"
    ]
  }

  const currentQuestions = quickQuestions[currentLanguage] || quickQuestions.hi

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-800">{t.chatTitle}</h2>
      
      <div
        ref={chatContainerRef}
        className="h-96 border border-gray-300 rounded-lg overflow-y-auto p-4 my-4 bg-gray-50"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`my-3 p-3 rounded-2xl max-w-4/5 break-words text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-blue-800 text-white ml-auto text-right'
                : 'bg-white text-gray-700 mr-auto border border-gray-200'
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">त्वरित प्रश्न:</p>
        <div className="flex flex-wrap gap-2">
          {currentQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => {
                addMessage(question, 'user')
                setTimeout(() => {
                  const response = generateBotResponse(question)
                  addMessage(response, 'bot')
                }, 1000)
              }}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t.askQuestion}
          className="flex-1 p-3 border border-gray-300 rounded-full text-base bg-white transition-colors focus:outline-none focus:border-blue-800 focus:shadow-sm focus:shadow-blue-800/10"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-blue-800 text-white border-none rounded-full cursor-pointer font-medium transition-colors hover:bg-blue-900 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-800/20"
        >
          {t.send}
        </button>
      </div>

      <button
        onClick={clearChat}
        className="w-full mt-2 p-3 bg-blue-800 text-white border-none rounded-md cursor-pointer text-base font-medium transition-colors hover:bg-blue-900"
      >
        {t.clearChat}
      </button>
    </div>
  )
}

export default ChatTab