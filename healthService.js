// Health assessment service with offline capabilities
const symptomDatabase = {
  fever: {
    hi: { symptoms: ['बुखार', 'गर्मी', 'तापमान'], response: 'आराम करें, पानी पिएं। अगर 3 दिन से ज्यादा बुखार हो तो डॉक्टर से मिलें।' },
    en: { symptoms: ['fever', 'temperature', 'hot'], response: 'Rest and drink fluids. See doctor if fever persists over 3 days.' }
  },
  cough: {
    hi: { symptoms: ['खांसी', 'कफ'], response: 'गर्म पानी पिएं, शहद लें। 2 सप्ताह से ज्यादा खांसी हो तो जांच कराएं।' },
    en: { symptoms: ['cough', 'cold'], response: 'Drink warm water, take honey. Get checked if cough persists over 2 weeks.' }
  },
  headache: {
    hi: { symptoms: ['सिरदर्द', 'सिर में दर्द'], response: 'आराम करें, पानी पिएं। तेज दर्द हो तो तुरंत डॉक्टर से मिलें।' },
    en: { symptoms: ['headache', 'head pain'], response: 'Rest and hydrate. See doctor immediately for severe pain.' }
  },
  stomach: {
    hi: { symptoms: ['पेट दर्द', 'पेट में दर्द', 'दस्त'], response: 'हल्का खाना खाएं, ORS पिएं। तेज दर्द या खून आए तो तुरंत अस्पताल जाएं।' },
    en: { symptoms: ['stomach pain', 'diarrhea', 'loose motion'], response: 'Eat light food, drink ORS. Go to hospital for severe pain or blood.' }
  }
};

const riskAssessment = {
  high: ['सांस लेने में तकलीफ', 'छाती में दर्द', 'बेहोशी', 'तेज बुखार', 'खून की उल्टी'],
  medium: ['लगातार खांसी', 'सिरदर्द', 'पेट दर्द', 'चक्कर आना'],
  low: ['हल्का बुखार', 'थकान', 'भूख न लगना']
};

export const healthAssessment = async (query, language = 'hi') => {
  try {
    const lowerQuery = query.toLowerCase();
    
    // Check for high-risk symptoms
    const highRiskSymptoms = riskAssessment.high.some(symptom => 
      lowerQuery.includes(symptom.toLowerCase())
    );
    
    if (highRiskSymptoms) {
      return {
        risk: 'high',
        response: language === 'hi' 
          ? 'यह गंभीर लक्षण है। तुरंत नजदीकी अस्पताल जाएं या 108 पर कॉल करें।'
          : 'This is a serious symptom. Go to nearest hospital immediately or call emergency.'
      };
    }
    
    // Find matching symptoms
    for (const [condition, data] of Object.entries(symptomDatabase)) {
      const symptoms = data[language]?.symptoms || data.en.symptoms;
      const match = symptoms.some(symptom => lowerQuery.includes(symptom.toLowerCase()));
      
      if (match) {
        return {
          risk: 'medium',
          condition,
          response: data[language]?.response || data.en.response
        };
      }
    }
    
    // Default response
    return {
      risk: 'low',
      response: language === 'hi'
        ? 'कृपया अपने लक्षणों के बारे में और बताएं। अगर परेशानी बढ़े तो स्वास्थ्य कर्मी से मिलें।'
        : 'Please describe your symptoms in more detail. Contact health worker if problems persist.'
    };
    
  } catch (error) {
    console.error('Health assessment error:', error);
    return {
      risk: 'unknown',
      response: language === 'hi'
        ? 'माफ करें, कुछ गलती हुई है। कृपया दोबारा कोशिश करें।'
        : 'Sorry, something went wrong. Please try again.'
    };
  }
};

export const getEmergencyContacts = () => {
  return [
    { name: 'आपातकाल', number: '108', type: 'emergency' },
    { name: 'स्वास्थ्य केंद्र', number: '+911234567890', type: 'health' },
    { name: 'डॉक्टर', number: '+919876543210', type: 'doctor' }
  ];
};

export const getFirstAidInstructions = (emergency) => {
  const instructions = {
    breathing: {
      hi: ['सांस न आने पर:', '1. व्यक्ति को सीधा बिठाएं', '2. कपड़े ढीले करें', '3. तुरंत 108 कॉल करें'],
      en: ['For breathing problems:', '1. Sit person upright', '2. Loosen clothing', '3. Call emergency immediately']
    },
    bleeding: {
      hi: ['खून बहने पर:', '1. साफ कपड़े से दबाएं', '2. घाव को ऊंचा रखें', '3. तुरंत अस्पताल ले जाएं'],
      en: ['For bleeding:', '1. Apply clean cloth pressure', '2. Elevate wound', '3. Rush to hospital']
    },
    unconscious: {
      hi: ['बेहोशी में:', '1. व्यक्ति को करवट पर लिटाएं', '2. सांस चेक करें', '3. तुरंत 108 कॉल करें'],
      en: ['For unconsciousness:', '1. Place person on side', '2. Check breathing', '3. Call emergency']
    }
  };
  
  return instructions[emergency] || instructions.breathing;
};