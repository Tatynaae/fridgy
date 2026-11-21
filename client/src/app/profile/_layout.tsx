import { Stack } from 'expo-router';

export default function ProfileStack() {
return (
<Stack
screenOptions={{
headerShown: true,
headerBackTitle: 'Назад',
gestureEnabled: true,
contentStyle: {
backgroundColor: '#F6FAFC',
},
}}
>
<Stack.Screen
name="index"
options={{ headerShown: false }}
/>

  <Stack.Screen
    name="personal-data"
    options={{ title: 'Личные данные' }}
  />

  <Stack.Screen
    name="nutrition-settings"
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