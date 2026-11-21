import { StyleSheet, Text, View } from 'react-native';

import { useAuthTheme } from '@/hooks/use-auth-theme';
import { InfoIcon } from './auth-icons';

// Красная плашка с ошибкой сервера над формой («Неверный email или пароль»).
export function ErrorBanner({ text }: { text: string }) {
  const t = useAuthTheme();
  return (
    <View style={[styles.banner, { backgroundColor: t.dangerBg }]}>
      <InfoIcon color={t.danger} />
      <Text style={[styles.text, { color: t.danger }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  text: {
    flex: 1,
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
});
