const GROQ_API_KEY = import.meta.env.VITE_XAI_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export const getHealthAdvice = async (query, language) => {
  if (!GROQ_API_KEY) {
    console.error('Groq API key is not configured')
    throw new Error('API key not configured')
  }

  const systemPrompts = {
    hi: `आप एक अनुभवी ग्रामीण स्वास्थ्य सलाहकार हैं। सुरक्षित, व्यावहारिक सलाह दें। केवल हिंदी में उत्तर दें। गंभीर मामलों में तुरंत डॉक्टर से मिलने की सलाह दें।

कृपया निम्नलिखित फॉर्मेट में उत्तर दें:
1. तत्काल करने योग्य कार्य (2-3 बिंदु)
2. घरेलू उपचार
3. कब डॉक्टर से मिलें
4. बचाव के उपाय`,
    en: `You are an experienced rural health advisor. Provide safe, practical advice. Answer only in English. Advise immediate medical attention for serious cases.

Please provide your answer in the following format:
1. Immediate actions (2-3 points)
2. Home remedies
3. When to see a doctor
4. Prevention measures`,
    bn: `আপনি একজন অভিজ্ঞ গ্রামীণ স্বাস্থ্য পরামর্শদাতা। নিরাপদ, ব্যবহারিক পরামর্শ দিন। শুধুমাত্র বাংলায় উত্তর দিন।`,
    te: `మీరు అనుభవజ్ఞుడైన గ్రామీణ ఆరోగ్య సలహాదారు. సురక్షితమైన, ఆచరణీయమైన సలహా ఇవ్వండి. తెలుగులో మాత్రమే సమాధానం ఇవ్వండి.`
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompts[language] || systemPrompts.hi
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.3,
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API Error:', errorText)
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content
    }
    
    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Groq API Error:', error)
    
    const fallbackResponses = {
      hi: "कृपया अपने स्थानीय स्वास्थ्य कर्मी से संपर्क करें। आपातकाल में 108 डायल करें।",
      en: "Please contact your local health worker. In emergency, dial 108.",
      bn: "অনুগ্রহ করে আপনার স্থানীয় স্বাস্থ্যকর্মীর সাথে যোগাযোগ করুন। জরুরি অবস্থায় ১০৮ ডায়াল করুন।",
      te: "దయచేసి మీ స్థానిక ఆరోగ్య కార్యకర్తను సంప్రదించండి. అత్యవసర పరిస్థితుల్లో 108 డయల్ చేయండి।"
    }
    
    return fallbackResponses[language] || fallbackResponses.hi
  }
}
