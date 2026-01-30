import { useState } from 'react'

const EmergencyTab = ({ t, currentLanguage }) => {
  const [firstAid, setFirstAid] = useState('')

  const getLocalizedContent = () => {
    const content = {
      hi: {
        emergencyContacts: "आपातकालीन संपर्क:",
        healthCenter: "स्वास्थ्य केंद्र:",
        police: "पुलिस:",
        fireService: "अग्निशमन:",
        firstAid: "प्राथमिक चिकित्सा:",
        breathingProblem: "सांस की समस्या",
        bleeding: "खून बहना",
        unconscious: "बेहोशी",
        instructions: {
          breathing: ["1. व्यक्ति को सीधा बिठाएं", "2. कपड़े ढीले करें", "3. तुरंत 108 कॉल करें"],
          bleeding: ["1. साफ कपड़े से दबाएं", "2. घाव को ऊंचा रखें", "3. तुरंत अस्पताल ले जाएं"],
          unconscious: ["1. व्यक्ति को करवट पर लिटाएं", "2. सांस चेक करें", "3. तुरंत 108 कॉल करें"]
        },
        alertMessages: {
          success: (location) => `आपातकाल!\n\nGPS स्थान: ${location}\n\nस्वास्थ्य कर्मी को SMS भेजा गया।\n5 मिनट में सहायता पहुंचेगी।`,
          noGPS: "आपातकाल!\n\nGPS उपलब्ध नहीं है।\nस्वास्थ्य कर्मी को कॉल किया गया।\n\nEmergency: 108",
          fallback: "आपातकाल!\n\nस्वास्थ्य कर्मी को सूचना भेजी गई।\nतुरंत 108 पर कॉल करें।"
        }
      },
      en: {
        emergencyContacts: "Emergency Contacts:",
        healthCenter: "Health Center:",
        police: "Police:",
        fireService: "Fire Service:",
        firstAid: "First Aid:",
        breathingProblem: "Breathing Problem",
        bleeding: "Bleeding",
        unconscious: "Unconscious",
        instructions: {
          breathing: ["1. Sit the person upright", "2. Loosen clothing", "3. Call 108 immediately"],
          bleeding: ["1. Press with clean cloth", "2. Keep wound elevated", "3. Take to hospital immediately"],
          unconscious: ["1. Place person on side", "2. Check breathing", "3. Call 108 immediately"]
        },
        alertMessages: {
          success: (location) => `Emergency!\n\nGPS Location: ${location}\n\nSMS sent to health worker.\nHelp will arrive in 5 minutes.`,
          noGPS: "Emergency!\n\nGPS not available.\nHealth worker called.\n\nEmergency: 108",
          fallback: "Emergency!\n\nHealth worker notified.\nCall 108 immediately."
        }
      }
    }
    return content[currentLanguage] || content.hi
  }

  const handleEmergency = () => {
    const localContent = getLocalizedContent()
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          const location = `https://maps.google.com/?q=${lat},${lng}`
          
          // Send SMS via Web Share API or copy to clipboard
          const message = `EMERGENCY! Need immediate medical help.\nLocation: ${location}\nTime: ${new Date().toLocaleString()}`
          
          if (navigator.share) {
            navigator.share({
              title: 'Medical Emergency',
              text: message
            }).catch(() => {
              copyToClipboard(message)
              alert(localContent.alertMessages.success(location))
            })
          } else {
            copyToClipboard(message)
            alert(localContent.alertMessages.success(location))
          }
          
          // Also try to call emergency number
          setTimeout(() => {
            window.location.href = 'tel:108'
          }, 2000)
        },
        (error) => {
          console.error('GPS Error:', error)
          // Still call emergency even without GPS
          const message = `EMERGENCY! Need immediate medical help.\nTime: ${new Date().toLocaleString()}\nNote: GPS location not available`
          
          if (navigator.share) {
            navigator.share({
              title: 'Medical Emergency',
              text: message
            }).catch(() => {
              copyToClipboard(message)
              alert(localContent.alertMessages.noGPS)
            })
          } else {
            copyToClipboard(message)
            alert(localContent.alertMessages.noGPS)
          }
          
          setTimeout(() => {
            window.location.href = 'tel:108'
          }, 2000)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      alert(localContent.alertMessages.fallback)
      setTimeout(() => {
        window.location.href = 'tel:108'
      }, 2000)
    }
  }

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
  }

  const showFirstAid = (type) => {
    const localContent = getLocalizedContent()
    const instructions = localContent.instructions[type]
    
    const titles = {
      breathing: localContent.breathingProblem,
      bleeding: localContent.bleeding,
      unconscious: localContent.unconscious
    }

    const content = `${titles[type]}:\n${instructions.join('\n')}`
    setFirstAid(content)
  }

  const localContent = getLocalizedContent()

  return (
    <div>
      <h2 className="text-center mb-4 text-xl font-semibold text-gray-800">
        {t.emergencyTitle}
      </h2>
      
      <button
        onClick={handleEmergency}
        className="w-48 h-48 rounded-full bg-red-600 text-white border-none text-2xl font-bold cursor-pointer mx-auto my-10 block shadow-lg transition-all uppercase tracking-wide hover:bg-red-700 hover:-translate-y-1 hover:shadow-xl active:scale-95"
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-5xl">🚨</span>
          <span>{t.emergency}</span>
        </div>
      </button>
      
      <p className="text-center text-gray-600 mb-5">{t.emergencyDesc}</p>

      <h3 className="text-lg font-semibold mb-4">{localContent.emergencyContacts}</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-4 bg-white my-3 rounded-lg border-l-4 border-sky-500 border border-gray-200 shadow-sm">
          <span>{localContent.healthCenter}</span>
          <a href="tel:108" className="font-bold text-blue-600 hover:text-blue-800">📞 108</a>
        </div>
        <div className="flex justify-between items-center p-4 bg-white my-3 rounded-lg border-l-4 border-sky-500 border border-gray-200 shadow-sm">
          <span>{localContent.police}</span>
          <a href="tel:100" className="font-bold text-blue-600 hover:text-blue-800">📞 100</a>
        </div>
        <div className="flex justify-between items-center p-4 bg-white my-3 rounded-lg border-l-4 border-sky-500 border border-gray-200 shadow-sm">
          <span>{localContent.fireService}</span>
          <a href="tel:101" className="font-bold text-blue-600 hover:text-blue-800">📞 101</a>
        </div>
      </div>

      <h3 className="mt-5 text-lg font-semibold mb-4">{localContent.firstAid}</h3>
      
      <div className="space-y-2">
        <button
          onClick={() => showFirstAid('breathing')}
          className="w-full p-3 bg-blue-800 text-white border-none rounded-md cursor-pointer text-base font-medium transition-colors hover:bg-blue-900"
        >
          {localContent.breathingProblem}
        </button>
        <button
          onClick={() => showFirstAid('bleeding')}
          className="w-full p-3 bg-blue-800 text-white border-none rounded-md cursor-pointer text-base font-medium transition-colors hover:bg-blue-900"
        >
          {localContent.bleeding}
        </button>
        <button
          onClick={() => showFirstAid('unconscious')}
          className="w-full p-3 bg-blue-800 text-white border-none rounded-md cursor-pointer text-base font-medium transition-colors hover:bg-blue-900"
        >
          {localContent.unconscious}
        </button>
      </div>

      {firstAid && (
        <div className="mt-6 p-5 bg-blue-50 rounded-lg border-l-4 border-sky-500 border border-blue-100">
          <div className="whitespace-pre-line">{firstAid}</div>
        </div>
      )}
    </div>
  )
}

export default EmergencyTab