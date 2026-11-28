import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from '@expo-google-fonts/manrope';
import type { ReactNode } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title?: string;
  /** Голубой блок «AI-помощник» с подсказкой под заголовком */
  hint?: string;
  children?: ReactNode;
  /** Контент, прижатый к низу экрана (главная кнопка) */
  bottom?: ReactNode;
};

export function AuthLayout({ title, hint, children, bottom }: Props) {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image style={styles.logo} source={require('@/assets/img/logo.png')} />
          {!!title && <Text style={styles.title}>{title}</Text>}
          {!!hint && (
            <View style={styles.hint}>
              <Text style={styles.hintLabel}>AI-помощник</Text>
              <Text style={styles.hintText}>{hint}</Text>
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </ScrollView>
        {!!bottom && <View style={styles.bottom}>{bottom}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#F6FAFC' },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 },
  logo: { width: 65, height: 52, marginLeft: 4 },
  title: {
    marginTop: 48,
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: 'Manrope_700Bold',
    fontSize: 28,
    lineHeight: 36,
    color: '#192C38',
  },
  hint: {
    backgroundColor: '#EAF7FD',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 12,
    marginBottom: 16,
  },
  hintLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: '#168CE1',
  },
  hintText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: '#546871',
  },
  content: { gap: 12 },
  bottom: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8 },
});
