import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { SessionProvider, useSession } from '@/auth/session';
import { AnimatedSplashOverlay } from '@/components/animated-icon';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <Routes />
        <AnimatedSplashOverlay />
      </SessionProvider>
    </ThemeProvider>
  );
}

function Routes() {
  const { user, loading, restoreError, restore } = useSession();

  if (loading || restoreError) {
    return (
      <View style={styles.center}>
        {loading ? (
          <ActivityIndicator
            color="#176DAA"
            accessibilityLabel="Загрузка сессии"
          />
        ) : (
          <>
            <Text>Не удалось восстановить сессию.</Text>
            <Button title="Повторить" onPress={() => void restore()} />
          </>
        )}
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={Boolean(user)}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#F6FAFC',
  },
});
