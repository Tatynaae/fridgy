import { createStackNavigator } from '@react-navigation/stack';

import ProfileMain from '@/screens/profile/ProfileMain';
import PersonalData from '@/screens/profile/PersonalData';
import NutritionSettings from '@/screens/profile/NutritionSettings';
import Notifications from '@/screens/profile/Notifications';
import Support from '@/screens/profile/Support';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  PersonalData: undefined;
  NutritionSettings: undefined;
  Notifications: undefined;
  Support: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

export default function ProfileScreen() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={{
        headerBackTitle: 'Назад',
        headerTintColor: '#192C38',
        headerStyle: { backgroundColor: '#F6FAFC' },
        headerTitleStyle: { fontFamily: 'Manrope_600SemiBold' },
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMain}
        options={{ headerShown: false }}
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
        options={{ title: 'Служба поддержки' }}
      />
    </Stack.Navigator>
  );
}
