import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ gestureEnabled: true, headerBackTitle: 'Назад' }}>
      <Stack.Screen name="index" options={{ title: 'Профиль', headerShown: false }} />
      <Stack.Screen name="PersonalData" options={{ title: 'Личные данные' }} />
      <Stack.Screen name="NutritionSettings" options={{ title: 'Настройки питания' }} />
      <Stack.Screen name="Notifications" options={{ title: 'Уведомления' }} />
      <Stack.Screen name="Support" options={{ title: 'Служба поддержки' }} />
    </Stack>
  );
}
