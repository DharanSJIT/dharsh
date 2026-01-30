import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { sendSMS } from 'react-native-sms';

const EmergencyButton = () => {
  const [isEmergency, setIsEmergency] = useState(false);

  const handleEmergency = () => {
    Alert.alert(
      'आपातकाल',
      'क्या आप वाकई आपातकालीन सहायता चाहते हैं?',
      [
        { text: 'रद्द करें', style: 'cancel' },
        { text: 'हाँ', onPress: triggerEmergency }
      ]
    );
  };

  const triggerEmergency = () => {
    setIsEmergency(true);
    
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = `https://maps.google.com/?q=${latitude},${longitude}`;
        
        const message = `आपातकाल! मुझे तुरंत सहायता चाहिए। मेरा स्थान: ${location}`;
        
        // Send SMS to emergency contacts
        const emergencyContacts = ['+911234567890', '+919876543210'];
        emergencyContacts.forEach(number => {
          sendSMS({
            body: message,
            recipients: [number],
            successTypes: ['sent', 'queued']
          });
        });
        
        Alert.alert('सहायता भेजी गई', 'आपातकालीन संदेश भेजा गया है।');
        setIsEmergency(false);
      },
      (error) => {
        console.log(error);
        Alert.alert('त्रुटि', 'स्थान प्राप्त नहीं हो सका।');
        setIsEmergency(false);
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>आपातकालीन सहायता</Text>
      
      <TouchableOpacity 
        style={[styles.emergencyButton, isEmergency && styles.processing]}
        onPress={handleEmergency}
        disabled={isEmergency}
      >
        <Text style={styles.emergencyText}>
          {isEmergency ? 'भेजा जा रहा है...' : 'आपातकाल'}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>तुरंत सहायता के लिए:</Text>
        <Text style={styles.infoText}>• बटन दबाएं</Text>
        <Text style={styles.infoText}>• GPS स्थान भेजा जाएगा</Text>
        <Text style={styles.infoText}>• स्वास्थ्य कर्मी को SMS मिलेगा</Text>
        <Text style={styles.infoText}>• 5 मिनट में सहायता पहुंचेगी</Text>
      </View>

      <View style={styles.contactsContainer}>
        <Text style={styles.contactTitle}>आपातकालीन नंबर:</Text>
        <Text style={styles.contact}>स्वास्थ्य केंद्र: 108</Text>
        <Text style={styles.contact}>पुलिस: 100</Text>
        <Text style={styles.contact}>अग्निशमन: 101</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 40 },
  emergencyButton: {
    backgroundColor: '#F44336',
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 10
  },
  processing: { backgroundColor: '#FF9800' },
  emergencyText: { color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  infoContainer: { marginBottom: 30, alignItems: 'center' },
  infoTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  infoText: { fontSize: 14, marginBottom: 5 },
  contactsContainer: { alignItems: 'center' },
  contactTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  contact: { fontSize: 14, marginBottom: 5 }
});

export default EmergencyButton;