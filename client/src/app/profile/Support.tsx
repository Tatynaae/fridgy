import { View, Text, StyleSheet } from 'react-native';

export default function Support() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Служба поддержки</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F6FAFC' },
  text: { fontFamily: 'Manrope_500Medium', fontSize: 15, color: '#192C38' },
});