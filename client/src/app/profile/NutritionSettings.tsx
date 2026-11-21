import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function NutritionSettings() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Здесь можно будет указать пищевые предпочтения и продукты, которых вы избегаете.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
