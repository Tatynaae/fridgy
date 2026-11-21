import { Stack } from 'expo-router';

// Stack Navigator вкладки Profile.
// Назад: кнопка в хедере (все платформы), системная кнопка «Назад» на Android,
// свайп от левого края на iOS (gestureEnabled).
export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#F6FAFC' },
        headerTintColor: '#192C38',
        headerTitleStyle: { fontFamily: 'Manrope_600SemiBold', fontSize: 18 },
        headerBackButtonDisplayMode: 'minimal',
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        contentStyle: { backgroundColor: '#F6FAFC' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false, title: 'ProfileMain' }} />
      <Stack.Screen name="personal-data" options={{ title: 'Личные данные' }} />
      <Stack.Screen name="nutrition-settings" options={{ title: 'Настройки питания' }} />
      <Stack.Screen name="notifications" options={{ title: 'Уведомления' }} />
      <Stack.Screen name="support" options={{ title: 'Служба поддержки' }} />
    </Stack>
  );
}
