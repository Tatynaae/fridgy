import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="personal"
        options={{ title: 'Личные данные' }}
      />

      <Stack.Screen
        name="nutrition"
        options={{ title: 'Настройки питания' }}
      />

      <Stack.Screen
        name="notifications"
        options={{ title: 'Уведомления' }}
      />

      <Stack.Screen
        name="support"
        options={{ title: 'Служба поддержки' }}
      />
    </Stack>
  );
}
