import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function Notifications() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Здесь можно будет настроить напоминания и уведомления.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
