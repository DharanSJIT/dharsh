import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';

const SimpleDemo = () => {
  const [activeTab, setActiveTab] = useState('voice');
  const [isListening, setIsListening] = useState(false);
  const [voiceResult, setVoiceResult] = useState('');
  const [familySize, setFamilySize] = useState('4');
  const [budget, setBudget] = useState('2');
  const [mealPlan, setMealPlan] = useState(null);

  // Simulate voice recognition
  const simulateVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setVoiceResult('आपको बुखार है। आराम करें और पानी पिएं। अगर 3 दिन से ज्यादा बुखार हो तो डॉक्टर से मिलें।');
      setIsListening(false);
    }, 2000);
  };

  // Generate meal plan
  const generatePlan = () => {
    const plans = [
      { name: 'दाल चावल', cost: '₹35', ingredients: 'दाल, चावल, प्याज' },
      { name: 'सब्जी रोटी', cost: '₹28', ingredients: 'गेहूं, आलू, टमाटर' },
      { name: 'खिचड़ी', cost: '₹32', ingredients: 'चावल, दाल, आलू' }
    ];
    setMealPlan(plans);
  };

  // Emergency alert
  const handleEmergency = () => {
    Alert.alert('आपातकाल', 'GPS स्थान भेजा गया। स्वास्थ्य कर्मी 5 मिनट में पहुंचेंगे।');
  };

  const renderVoiceTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.title}>स्वास्थ्य सहायक</Text>
      <TouchableOpacity 
        style={[styles.voiceButton, isListening && styles.listening]}
        onPress={simulateVoice}
      >
        <Text style={styles.voiceButtonText}>
          {isListening ? 'सुन रहा है...' : 'बोलें'}
        </Text>
      </TouchableOpacity>
      {voiceResult ? <Text style={styles.result}>{voiceResult}</Text> : null}
    </View>
  );

  const renderNutritionTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.title}>पोषण योजना</Text>
      <TextInput
        style={styles.input}
        placeholder="परिवार का आकार"
        value={familySize}
        onChangeText={setFamilySize}
      />
      <TextInput
        style={styles.input}
        placeholder="दैनिक बजट ($)"
        value={budget}
        onChangeText={setBudget}
      />
      <TouchableOpacity style={styles.button} onPress={generatePlan}>
        <Text style={styles.buttonText}>योजना बनाएं</Text>
      </TouchableOpacity>
      {mealPlan && (
        <View style={styles.planContainer}>
          {mealPlan.map((meal, index) => (
            <View key={index} style={styles.mealItem}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealCost}>{meal.cost}</Text>
              <Text style={styles.ingredients}>{meal.ingredients}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderEmergencyTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.title}>आपातकालीन सहायता</Text>
      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
        <Text style={styles.emergencyText}>आपातकाल</Text>
      </TouchableOpacity>
      <Text style={styles.info}>GPS स्थान के साथ तुरंत SMS भेजा जाएगा</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'voice' && styles.activeTab]}
          onPress={() => setActiveTab('voice')}
        >
          <Text style={styles.tabText}>Voice</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]}
          onPress={() => setActiveTab('nutrition')}
        >
          <Text style={styles.tabText}>Nutrition</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'emergency' && styles.activeTab]}
          onPress={() => setActiveTab('emergency')}
        >
          <Text style={styles.tabText}>Emergency</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'voice' && renderVoiceTab()}
        {activeTab === 'nutrition' && renderNutritionTab()}
        {activeTab === 'emergency' && renderEmergencyTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabBar: { flexDirection: 'row', backgroundColor: 'white', elevation: 2 },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  activeTab: { backgroundColor: '#4CAF50' },
  tabText: { fontWeight: 'bold' },
  content: { flex: 1 },
  tabContent: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  voiceButton: { backgroundColor: '#4CAF50', width: 150, height: 150, borderRadius: 75, justifyContent: 'center', alignItems: 'center' },
  listening: { backgroundColor: '#FF5722' },
  voiceButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  result: { marginTop: 20, fontSize: 16, textAlign: 'center', padding: 15, backgroundColor: 'white', borderRadius: 10 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ddd', padding: 15, marginBottom: 15, borderRadius: 5, backgroundColor: 'white' },
  button: { backgroundColor: '#2196F3', padding: 15, borderRadius: 5, width: '100%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  planContainer: { marginTop: 20, width: '100%' },
  mealItem: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 5 },
  mealName: { fontSize: 18, fontWeight: 'bold' },
  mealCost: { fontSize: 16, color: '#4CAF50', marginTop: 5 },
  ingredients: { fontSize: 14, color: '#666', marginTop: 5 },
  emergencyButton: { backgroundColor: '#F44336', width: 200, height: 200, borderRadius: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  emergencyText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  info: { textAlign: 'center', fontSize: 16, color: '#666' }
});

export default SimpleDemo;