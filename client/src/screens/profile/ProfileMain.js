import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OPTIONS = [
  { title: 'Личные данные', screen: 'PersonalData' },
  { title: 'Настройки питания', screen: 'NutritionSettings' },
  { title: 'Уведомления', screen: 'Notifications' },
  { title: 'Поддержка', screen: 'Support' },
];

export default function ProfileMain({ navigation }) {
  return (
    <View style={styles.container}>
      {OPTIONS.map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={styles.item}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Text style={styles.text}>{item.title}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 8 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  text: { fontSize: 16 },
  arrow: { fontSize: 22, color: '#999' },
});