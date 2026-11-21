import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function Support() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Здесь будут ответы на частые вопросы и способы связаться с поддержкой.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
