import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuthTheme } from '@/hooks/use-auth-theme';

type Props = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

// Центральный блок экранов «Проверьте почту!» и «Пароль обновлен!»: большая иконка, заголовок, подпись.
export function StatusView({ icon, title, subtitle }: Props) {
  const t = useAuthTheme();
  return (
    <View style={styles.wrapper}>
      {icon}
      <Text style={[styles.title, { color: t.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: t.secondary }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 36,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    marginTop: 12,
    fontFamily: 'Manrope_700Bold',
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'center',
  },
  subtitle: {
    maxWidth: 240,
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
});
