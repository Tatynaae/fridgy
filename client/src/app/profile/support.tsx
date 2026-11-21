import { View, Text, StyleSheet } from 'react-native';

export default function Support() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Служба поддержки</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FAFC',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Manrope_600SemiBold',
    color: '#192C38',
  },
});