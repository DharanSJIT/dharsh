import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const HealthTracker = () => {
  const [medications, setMedications] = useState([]);
  const [newMed, setNewMed] = useState({ name: '', time: '', dosage: '' });
  const [healthData, setHealthData] = useState({ bp: '', sugar: '', weight: '' });

  useEffect(() => {
    loadData();
    setupNotifications();
  }, []);

  const loadData = async () => {
    try {
      const meds = await AsyncStorage.getItem('medications');
      const health = await AsyncStorage.getItem('healthData');
      if (meds) setMedications(JSON.parse(meds));
      if (health) setHealthData(JSON.parse(health));
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const setupNotifications = () => {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log('Notification:', notification);
      },
      requestPermissions: Platform.OS === 'ios'
    });
  };

  const addMedication = async () => {
    if (!newMed.name || !newMed.time) return;
    
    const medication = {
      id: Date.now(),
      ...newMed,
      taken: false
    };
    
    const updatedMeds = [...medications, medication];
    setMedications(updatedMeds);
    await AsyncStorage.setItem('medications', JSON.stringify(updatedMeds));
    
    // Schedule notification
    PushNotification.localNotificationSchedule({
      title: 'दवा का समय',
      message: `${newMed.name} लेने का समय हो गया`,
      date: new Date(Date.now() + 60 * 1000), // 1 minute from now for demo
      repeatType: 'day'
    });
    
    setNewMed({ name: '', time: '', dosage: '' });
  };

  const markTaken = async (id) => {
    const updatedMeds = medications.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    );
    setMedications(updatedMeds);
    await AsyncStorage.setItem('medications', JSON.stringify(updatedMeds));
  };

  const saveHealthData = async () => {
    await AsyncStorage.setItem('healthData', JSON.stringify(healthData));
  };

  const renderMedication = ({ item }) => (
    <View style={styles.medicationItem}>
      <View style={styles.medInfo}>
        <Text style={styles.medName}>{item.name}</Text>
        <Text style={styles.medDetails}>{item.time} - {item.dosage}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.takenButton, item.taken && styles.takenButtonActive]}
        onPress={() => markTaken(item.id)}
      >
        <Text style={styles.takenText}>{item.taken ? '✓' : '○'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>स्वास्थ्य ट्रैकर</Text>
      
      {/* Add Medication */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>दवा जोड़ें:</Text>
        <TextInput
          style={styles.input}
          placeholder="दवा का नाम"
          value={newMed.name}
          onChangeText={(text) => setNewMed({...newMed, name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="समय (जैसे: 8:00 AM)"
          value={newMed.time}
          onChangeText={(text) => setNewMed({...newMed, time: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="खुराक"
          value={newMed.dosage}
          onChangeText={(text) => setNewMed({...newMed, dosage: text})}
        />
        <TouchableOpacity style={styles.addButton} onPress={addMedication}>
          <Text style={styles.addButtonText}>जोड़ें</Text>
        </TouchableOpacity>
      </View>

      {/* Medications List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>आज की दवाएं:</Text>
        <FlatList
          data={medications}
          renderItem={renderMedication}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {/* Health Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>स्वास्थ्य डेटा:</Text>
        <TextInput
          style={styles.input}
          placeholder="रक्तचाप (जैसे: 120/80)"
          value={healthData.bp}
          onChangeText={(text) => setHealthData({...healthData, bp: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="शुगर लेवल"
          value={healthData.sugar}
          onChangeText={(text) => setHealthData({...healthData, sugar: text})}
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveHealthData}>
          <Text style={styles.saveButtonText}>सेव करें</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 },
  addButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, alignItems: 'center' },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  medicationItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#f5f5f5', marginBottom: 5, borderRadius: 5 },
  medInfo: { flex: 1 },
  medName: { fontSize: 16, fontWeight: 'bold' },
  medDetails: { fontSize: 14, color: '#666' },
  takenButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  takenButtonActive: { backgroundColor: '#4CAF50' },
  takenText: { fontSize: 18, color: '#4CAF50' },
  saveButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold' }
});

export default HealthTracker;