import { configureStore, createSlice } from '@reduxjs/toolkit';

// Health slice for managing health data
const healthSlice = createSlice({
  name: 'health',
  initialState: {
    medications: [],
    healthRecords: [],
    emergencyContacts: [],
    language: 'hi'
  },
  reducers: {
    addMedication: (state, action) => {
      state.medications.push(action.payload);
    },
    updateMedication: (state, action) => {
      const index = state.medications.findIndex(med => med.id === action.payload.id);
      if (index !== -1) {
        state.medications[index] = action.payload;
      }
    },
    addHealthRecord: (state, action) => {
      state.healthRecords.push({
        ...action.payload,
        timestamp: new Date().toISOString()
      });
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setEmergencyContacts: (state, action) => {
      state.emergencyContacts = action.payload;
    }
  }
});

// Nutrition slice for meal planning
const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState: {
    currentPlan: null,
    familyProfile: {
      size: 4,
      budget: 2,
      preferences: []
    },
    nutritionHistory: []
  },
  reducers: {
    setMealPlan: (state, action) => {
      state.currentPlan = action.payload;
    },
    updateFamilyProfile: (state, action) => {
      state.familyProfile = { ...state.familyProfile, ...action.payload };
    },
    addNutritionRecord: (state, action) => {
      state.nutritionHistory.push({
        ...action.payload,
        date: new Date().toISOString().split('T')[0]
      });
    }
  }
});

export const { 
  addMedication, 
  updateMedication, 
  addHealthRecord, 
  setLanguage, 
  setEmergencyContacts 
} = healthSlice.actions;

export const { 
  setMealPlan, 
  updateFamilyProfile, 
  addNutritionRecord 
} = nutritionSlice.actions;

export const store = configureStore({
  reducer: {
    health: healthSlice.reducer,
    nutrition: nutritionSlice.reducer
  }
});