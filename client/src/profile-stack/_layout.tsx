import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Профиль' }} />
      <Stack.Screen name="PersonalData" options={{ title: 'Личные данные' }} />
      <Stack.Screen name="NutritionSettings" options={{ title: 'Настройки питания' }} />
      <Stack.Screen name="Notifications" options={{ title: 'Уведомления' }} />
      <Stack.Screen name="Support" options={{ title: 'Поддержка' }} />
    </Stack>
  );
}