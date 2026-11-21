import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type Props = { kind: 'mail' | 'success'; title: string; text: string };

// Экраны «Проверьте почту!» и «Пароль обновлён!»
export function StatusView({ kind, title, text }: Props) {
  return (
    <View style={styles.wrap}>
      {kind === 'mail' ? (
        <Ionicons name="mail-outline" size={168} color="#2A9FE0" />
      ) : (
        <Ionicons name="checkmark-circle-outline" size={168} color="#27A468" />
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginTop: 60, gap: 8 },
  title: {
    marginTop: 24,
    fontFamily: 'Manrope_700Bold',
    fontSize: 24,
    color: '#192C38',
    textAlign: 'center',
  },
  text: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#7C8488',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
