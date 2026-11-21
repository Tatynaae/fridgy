import type { ReactNode } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthTheme } from '@/hooks/use-auth-theme';

type Props = {
  title?: string;
  children?: ReactNode;
  /** Блок, прижатый к низу экрана (главная кнопка на экранах восстановления пароля) */
  bottom?: ReactNode;
};

// Каркас экранов авторизации по макету: логотип, заголовок 26/700 по центру, форма шириной 350 с gap 16.
export function AuthScreen({ title, children, bottom }: Props) {
  const t = useAuthTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: t.bg }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image style={styles.logo} source={require('../../../assets/img/logo.png')} />

          {title ? <Text style={[styles.title, { color: t.text }]}>{title}</Text> : null}

          <View style={styles.form}>{children}</View>

          {bottom ? <View style={styles.bottom}>{bottom}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  logo: {
    width: 65,
    height: 52,
  },
  title: {
    marginTop: 56,
    textAlign: 'center',
    fontFamily: 'Manrope_700Bold',
    fontSize: 26,
    lineHeight: 36,
  },
  form: {
    marginTop: 54,
    gap: 16,
  },
  bottom: {
    marginTop: 'auto',
    paddingTop: 24,
  },
});
