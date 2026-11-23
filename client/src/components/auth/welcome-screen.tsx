import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authColors, PrimaryButton } from './auth-layout';

export default function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('@/assets/img/logo.png')} />

        <View style={styles.center}>
          <View style={styles.circle}>
            <Ionicons name="checkmark" size={80} color="#27A567" />
          </View>
          <Text style={styles.title}>Аккаунт создан!</Text>
          <Text style={styles.subtitle}>
            Добро пожаловать в Fridgy. Давай найдём, что приготовить сегодня.
          </Text>
        </View>

        <PrimaryButton label="Начать" onPress={onStart} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: authColors.bg },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 },
  logo: { width: 65, height: 52 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 14,
    borderColor: '#27A567',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: { fontFamily: 'Manrope_700Bold', fontSize: 24, color: authColors.text },
  subtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: authColors.muted,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});