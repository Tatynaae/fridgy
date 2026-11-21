import { StyleSheet, Text, View } from 'react-native';

import { useAuthTheme } from '@/hooks/use-auth-theme';

// Карточка «AI-помощник» над формой.
export function AiCard({ text }: { text: string }) {
  const t = useAuthTheme();
  return (
    <View style={[styles.card, { backgroundColor: t.card }]}>
      <Text style={[styles.label, { color: t.link }]}>AI-помощник</Text>
      <Text style={[styles.text, { color: t.secondary }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 10,
  },
  label: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
  text: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
});
