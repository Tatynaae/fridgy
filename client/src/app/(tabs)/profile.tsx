import {
  useFonts,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { createNativeStackNavigator } from 'expo-router/native-stack';

import type { ProfileStackParamList } from '@/navigation/profile-stack-types';
import NotificationsScreen from '@/screens/notifications';
import NutritionSettingsScreen from '@/screens/nutrition-settings';
import PersonalDataScreen from '@/screens/personal-data';
import ProfileMainScreen from '@/screens/profile-main';
import SupportScreen from '@/screens/support';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

// Вкладка «Профиль» — это Stack Navigator: ProfileMain + 4 детальных экрана.
// Возврат назад работает «из коробки»: кнопка в хедере, кнопка «Назад» на Android
// и свайп от левого края на iOS (gestureEnabled включён по умолчанию).
export default function ProfileStack() {
  const [fontsLoaded] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={{
        headerStyle: { backgroundColor: '#F6FAFC' },
        headerShadowVisible: false,
        headerTintColor: '#168CE1',
        headerTitleStyle: {
          fontFamily: 'Manrope_600SemiBold',
          fontSize: 17,
          color: '#192C38',
        },
        headerBackButtonDisplayMode: 'minimal',
        gestureEnabled: true,
        contentStyle: { backgroundColor: '#F6FAFC' },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalData"
        component={PersonalDataScreen}
        options={{ title: 'Личные данные' }}
      />
      <Stack.Screen
        name="NutritionSettings"
        component={NutritionSettingsScreen}
        options={{ title: 'Настройки питания' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Уведомления' }}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{ title: 'Служба поддержки' }}
      />
    </Stack.Navigator>
  );
}
