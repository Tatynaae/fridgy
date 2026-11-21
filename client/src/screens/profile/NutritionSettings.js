import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NutritionSettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки питания</Text>
      <Text style={styles.subtitle}>Здесь будут диета, аллергены и цели по калориям</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#777', textAlign: 'center' },
});