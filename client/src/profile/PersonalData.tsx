import { View, Text, StyleSheet } from 'react-native';

export default function PersonalData() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Личные данные</Text>
      <Text>Здесь находятся личные данные пользователя.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F6FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#192C38',
    marginBottom: 16,
  },
});