import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './src/store';
import VoiceAssistant from './src/screens/VoiceAssistant';
import NutritionPlanner from './src/screens/NutritionPlanner';
import EmergencyButton from './src/screens/EmergencyButton';
import HealthTracker from './src/screens/HealthTracker';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Voice" component={VoiceAssistant} />
          <Tab.Screen name="Nutrition" component={NutritionPlanner} />
          <Tab.Screen name="Emergency" component={EmergencyButton} />
          <Tab.Screen name="Health" component={HealthTracker} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}