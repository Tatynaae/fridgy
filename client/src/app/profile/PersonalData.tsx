import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PersonalData() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Здесь будут отображаться имя и электронная почта аккаунта.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
