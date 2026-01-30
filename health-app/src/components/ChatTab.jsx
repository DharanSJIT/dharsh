import { useState, useEffect, useRef } from 'react'
import { getHealthAdvice } from '../services/geminiService'

const ChatTab = ({ t, currentLanguage }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const chatContainerRef = useRef(null)
  const typingIntervalRef = useRef(null)

  useEffect(() => {
    if (!initialized) {
      addMessage(t.greeting, 'bot')
      setInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const addMessage = (message, sender, typing = false) => {
    let cleanMessage = message.replace(/\*/g, '').trim()
    
    // Format as bullet points if it's a bot message (but not for greeting)
    if (sender === 'bot' && !message.includes('health assistant')) {
      cleanMessage = cleanMessage
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((line, index, arr) => {
          // If line doesn't start with number or bullet, add bullet
          if (!line.match(/^[0-9•\-]/) && line.length > 0) {
            line = '• ' + line
          }
          // Add extra line break before and after numbered sections (1., 2., 3., 4.)
          if (line.match(/^[0-9]\./) && index > 0) {
            line = '\n' + line
          }
          if (line.match(/^[0-9]\./) && index < arr.length - 1) {
            line = line + '\n'
          }
          return line
        })
        .join('\n')
    }
    
    if (typing && sender === 'bot') {
      const msgId = Date.now()
      setMessages(prev => [...prev, { message: '', sender, id: msgId, fullText: cleanMessage }])
      typeMessage(msgId, cleanMessage)
    } else {
      setMessages(prev => [...prev, { message: cleanMessage, sender, id: Date.now() }])
    }
  }

  const typeMessage = (msgId, fullText) => {
    setIsTyping(true)
    const words = fullText.split(' ')
    let index = 0
    
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
    }
    
    typingIntervalRef.current = setInterval(() => {
      if (index < words.length) {
        const displayText = words.slice(0, index + 1).join(' ')
        setMessages(prev => prev.map(msg => 
          msg.id === msgId ? { ...msg, message: displayText } : msg
        ))
        index++
      } else {
        clearInterval(typingIntervalRef.current)
        setIsTyping(false)
      }
    }, 100)
  }

  const generateBotResponse = async (message) => {
    const lowerMessage = message.toLowerCase()
    
    // Handle greetings and thanks locally
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
        lowerMessage.includes('नमस्ते') || lowerMessage.includes('हैलो')) {
      return currentLanguage === 'hi' ? 
        "नमस्ते! मैं आपका स्वास्थ्य सहायक हूं। आप अपनी समस्या बता सकते हैं।" :
        "Hello! I am your health assistant. You can tell me your problems."
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('धन्यवाद') || 
        lowerMessage.includes('शुक्रिया')) {
      return currentLanguage === 'hi' ? 
        "धन्यवाद! स्वस्थ रहें और जरूरत पड़ने पर संपर्क करें।" :
        "Thank you! Stay healthy and contact when needed."
    }
    
    // For health-related queries, use Gemini API
    try {
      const response = await getHealthAdvice(message, currentLanguage)
      return response
    } catch (error) {
      console.error('Error getting health advice:', error)
      return currentLanguage === 'hi' ? 
        "कृपया अपने स्थानीय स्वास्थ्य कर्मी से संपर्क करें। आपातकाल में 108 डायल करें।" :
        "Please contact your local health worker. In emergency, dial 108."
    }
  }

  const sendMessage = () => {
    if (inputMessage.trim() && !isTyping) {
      addMessage(inputMessage, 'user')
      const userMessage = inputMessage
      setInputMessage('')
      
      setTimeout(async () => {
        const response = await generateBotResponse(userMessage)
        addMessage(response, 'bot', true)
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

  const quickQuestionsLabel = {
    hi: "त्वरित प्रश्न:",
    en: "Quick Questions:"
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
            className={`my-3 p-4 rounded-2xl max-w-4/5 break-words text-sm leading-relaxed whitespace-pre-line ${
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
        <p className="text-sm text-gray-600 mb-2">{quickQuestionsLabel[currentLanguage] || quickQuestionsLabel.hi}</p>
        <div className="flex flex-wrap gap-2">
          {currentQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => {
                addMessage(question, 'user')
                setTimeout(async () => {
                  const response = await generateBotResponse(question)
                  addMessage(response, 'bot', true)
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
          disabled={isTyping}
          className="px-6 py-3 bg-blue-800 text-white border-none rounded-full cursor-pointer font-medium transition-colors hover:bg-blue-900 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-800/20 disabled:opacity-50 disabled:cursor-not-allowed"
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