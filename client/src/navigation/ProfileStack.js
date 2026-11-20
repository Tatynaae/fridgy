import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileMain from '../screens/profile/ProfileMain';
import PersonalData from '../screens/profile/PersonalData';
import NutritionSettings from '../screens/profile/NutritionSettings';
import Notifications from '../screens/profile/Notifications';
import Support from '../screens/profile/Support';

import ProfileStack from './ProfileStack';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={{
        headerBackTitle: 'Назад', // подпись у кнопки назад на iOS
        gestureEnabled: true,     // свайп назад на iOS (в native-stack включён по умолчанию)
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

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ headerShown: false }}  // чтобы не было двух хедеров: у вкладки и у стека
        />
    </Stack.Navigator>
  );
}