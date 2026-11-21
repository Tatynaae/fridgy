import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileMain from '../screens/profile/ProfileMain';
import PersonalData from '../screens/profile/PersonalData';
import NutritionSettings from '../screens/profile/NutritionSettings';
import Notifications from '../screens/profile/Notifications';
import Support from '../screens/profile/Support';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={{
        headerBackTitle: 'Назад', 
        gestureEnabled: true,    
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMain}
        options={{ title: 'Профиль' }}
      />
      <Stack.Screen
        name="PersonalData"
        component={PersonalData}
        options={{ title: 'Личные данные' }}
      />
      <Stack.Screen
        name="NutritionSettings"
        component={NutritionSettings}
        options={{ title: 'Настройки питания' }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{ title: 'Уведомления' }}
      />
      <Stack.Screen
        name="Support"
        component={Support}
        options={{ title: 'Поддержка' }}
      />
    </Stack.Navigator>
  );
}

