import { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const items = [
  'Новые рецепты',
  'Напоминания о продуктах',
  'Советы от Fridgy',
];

export default function Notifications() {
  const [values, setValues] = useState<Record<string, boolean>>({});

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item} style={styles.row}>
          <Text style={styles.label}>{item}</Text>
          <Switch
            value={!!values[item]}
            onValueChange={(value) => setValues({ ...values, [item]: value })}
          />
        </View>
      ))}
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
  row: {
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 15,
    color: '#192C38',
  },
});
