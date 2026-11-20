import { Stack } from 'expo-router';

// Keep ProfileMain below detail routes, including when opening a deep link.
export const unstable_settings = { anchor: 'ProfileMain' };

export default function ProfileStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Назад',
        headerTintColor: '#192C38',
        headerStyle: { backgroundColor: '#F6FAFC' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#F6FAFC' },
        gestureEnabled: true,
      }}>
      <Stack.Screen name="ProfileMain" options={{ title: 'Профиль', headerShown: false }} />
      <Stack.Screen name="PersonalData" options={{ title: 'Личные данные' }} />
      <Stack.Screen name="NutritionSettings" options={{ title: 'Настройки питания' }} />
      <Stack.Screen name="Notifications" options={{ title: 'Уведомления' }} />
      <Stack.Screen name="Support" options={{ title: 'Служба поддержки' }} />
    </Stack>
  );
}
