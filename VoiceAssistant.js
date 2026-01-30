import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { healthAssessment } from '../services/healthService';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState('');
  const [language, setLanguage] = useState('hi-IN'); // Hindi default

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    return () => Voice.destroy().then(Voice.removeAllListeners);
  }, []);

  const onSpeechResults = (e) => {
    const spokenText = e.value[0];
    setResult(spokenText);
    processHealthQuery(spokenText);
  };

  const onSpeechError = (e) => {
    console.log('Speech error:', e.error);
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start(language);
    } catch (e) {
      console.error(e);
    }
  };

  const processHealthQuery = async (query) => {
    const assessment = await healthAssessment(query, language);
    speak(assessment.response);
    setResult(assessment.response);
  };

  const speak = (text) => {
    Tts.setDefaultLanguage(language);
    Tts.speak(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>स्वास्थ्य सहायक</Text>
      <TouchableOpacity 
        style={[styles.button, isListening && styles.listening]}
        onPress={startListening}
      >
        <Text style={styles.buttonText}>
          {isListening ? 'सुन रहा है...' : 'बोलें'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.result}>{result}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 30 },
  button: { backgroundColor: '#4CAF50', padding: 20, borderRadius: 50, alignItems: 'center' },
  listening: { backgroundColor: '#FF5722' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  result: { marginTop: 20, fontSize: 16, textAlign: 'center' }
});

export default VoiceAssistant;