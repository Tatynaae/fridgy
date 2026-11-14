
import { View, Text, StyleSheet } from 'react-native';

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Уведомления</Text>
      <Text>Здесь находятся настройки уведомлений.</Text>
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
