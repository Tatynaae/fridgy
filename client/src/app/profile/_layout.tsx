import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Назад',
        headerTintColor: '#192C38',
        headerStyle: { backgroundColor: '#F6FAFC' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="PersonalData" options={{ title: 'Личные данные' }} />
      <Stack.Screen name="NutritionSettings" options={{ title: 'Настройки питания' }} />
      <Stack.Screen name="Notifications" options={{ title: 'Уведомления' }} />
      <Stack.Screen name="Support" options={{ title: 'Служба поддержки' }} />
    </Stack>
  );
}