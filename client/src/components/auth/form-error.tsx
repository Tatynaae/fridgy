import { StyleSheet, Text } from 'react-native';

// Ошибка от сервера (неверный пароль, email занят, нет сети)
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return <Text style={styles.text}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: { fontFamily: 'Manrope_400Regular', fontSize: 11, color: '#C8374D', textAlign: 'center' },
});
