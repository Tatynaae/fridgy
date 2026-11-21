import { View, Text, StyleSheet } from 'react-native';

export default function PersonalData() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Имя</Text>
        <Text style={styles.value}>user</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>user@example.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: '#F6FAFC',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    gap: 4,
  },
  label: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: '#7F919F',
  },
  value: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 16,
    color: '#192C38',
  },
});
