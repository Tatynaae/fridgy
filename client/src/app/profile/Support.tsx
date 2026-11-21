import { View, Text, StyleSheet } from 'react-native';

export default function Support() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Служба поддержки</Text>
      <Text>Здесь можно будет связаться со службой поддержки.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FAFC',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#192C38',
    marginBottom: 12,
  },
});