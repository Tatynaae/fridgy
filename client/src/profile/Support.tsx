
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Support() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Служба поддержки</Text>
        <View style={styles.card}>
          <Text style={styles.text}>
            Если у вас возникли вопросы, свяжитесь с нашей службой поддержки.
          </Text>
          <Text style={styles.text}>Email: support@example.com</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6FAFC',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#192C38',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#192C38',
    marginBottom: 12,
  },
});
