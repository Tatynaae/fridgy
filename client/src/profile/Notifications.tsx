
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notifications() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Уведомления</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Push-уведомления</Text>
          <Text style={styles.value}>Включены</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Напоминания о питании</Text>
          <Text style={styles.value}>Включены</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Другие уведомления</Text>
          <Text style={styles.value}>Включены</Text>
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
    backgroundColor: '#F6FAFC',
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
  label: {
    fontSize: 13,
    color: '#7F919F',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: '#192C38',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#E7EDF1',
    marginBottom: 15,
  },
});
