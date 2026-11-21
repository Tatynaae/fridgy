import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileColors } from '@/hooks/use-profile-colors';

type ProfileRoute = 'PersonalData' | 'NutritionSettings' | 'Notifications' | 'Support';
type ProfileNavigation = { navigate: (screen: ProfileRoute) => void };
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const OPTIONS: { title: string; screen: ProfileRoute; icon: IconName }[] = [
  { title: 'Личные данные', screen: 'PersonalData', icon: 'person-outline' },
  { title: 'Настройки питания', screen: 'NutritionSettings', icon: 'nutrition-outline' },
  { title: 'Уведомления', screen: 'Notifications', icon: 'notifications-outline' },
  { title: 'Служба поддержки', screen: 'Support', icon: 'headset-outline' },
];

export default function ProfileMain() {
  const navigation = useNavigation<ProfileNavigation>();
  const c = useProfileColors();

  const confirmLogout = () =>
    Alert.alert('Выйти из аккаунта', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive' },
    ]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: c.background }]}>
      <StatusBar hidden={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Image style={styles.logo} source={require('../../../assets/img/logo.png')} />

        <View style={[styles.info, { backgroundColor: c.card }]}>
          <Image style={styles.avatar} source={require('../../../assets/img/user.png')} />
          <Text style={[styles.name, { color: c.title }]}>Naima</Text>
          <Text style={[styles.email, { color: c.secondary }]}>user@example.com</Text>
        </View>

        <View style={styles.menu}>
          {OPTIONS.map((item) => (
            <Pressable
              key={item.screen}
              style={({ pressed }) => [
                styles.row,
                { backgroundColor: c.card },
                pressed && styles.pressed,
              ]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.iconWrap, { backgroundColor: c.iconBg }]}>
                <Ionicons name={item.icon} size={20} color={c.accent} />
              </View>
              <Text style={[styles.rowTitle, { color: c.text }]}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={c.secondary} />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logout,
            { backgroundColor: c.dangerBg },
            pressed && styles.pressed,
          ]}
          onPress={confirmLogout}
        >
          <Ionicons name="log-out-outline" size={22} color={c.danger} />
          <Text style={[styles.logoutText, { color: c.danger }]}>Выйти из аккаунта</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  logo: {
    width: 65,
    height: 52,
    marginBottom: 12,
  },
  info: {
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
  },
  name: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 24,
    marginTop: 12,
  },
  email: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    marginTop: 2,
  },
  menu: {
    marginTop: 28,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    flex: 1,
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 20,
    paddingVertical: 18,
    marginTop: 24,
  },
  logoutText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
  },
  pressed: {
    opacity: 0.6,
  },
});
