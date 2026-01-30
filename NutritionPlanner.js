import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { generateMealPlan } from './nutritionService';

const NutritionPlanner = () => {
  const [familySize, setFamilySize] = useState('4');
  const [budget, setBudget] = useState('2');
  const [mealPlan, setMealPlan] = useState(null);

  const createPlan = async () => {
    const plan = await generateMealPlan({
      familySize: parseInt(familySize),
      dailyBudget: parseFloat(budget),
      language: 'hi'
    });
    setMealPlan(plan);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>पोषण योजना</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>परिवार का आकार:</Text>
        <TextInput
          style={styles.input}
          value={familySize}
          onChangeText={setFamilySize}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>दैनिक बजट ($):</Text>
        <TextInput
          style={styles.input}
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={createPlan}>
        <Text style={styles.buttonText}>योजना बनाएं</Text>
      </TouchableOpacity>

      {mealPlan && (
        <View style={styles.planContainer}>
          <Text style={styles.planTitle}>आज का भोजन:</Text>
          {mealPlan.meals.map((meal, index) => (
            <View key={index} style={styles.meal}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealCost}>₹{meal.cost}</Text>
              <Text style={styles.ingredients}>{meal.ingredients.join(', ')}</Text>
            </View>
          ))}
          <Text style={styles.totalCost}>कुल लागत: ₹{mealPlan.totalCost}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5 },
  button: { backgroundColor: '#2196F3', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  planContainer: { marginTop: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 5 },
  planTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  meal: { marginBottom: 10, padding: 10, backgroundColor: 'white', borderRadius: 5 },
  mealName: { fontSize: 16, fontWeight: 'bold' },
  mealCost: { fontSize: 14, color: '#666' },
  ingredients: { fontSize: 12, color: '#888', marginTop: 5 },
  totalCost: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }
});

export default NutritionPlanner;