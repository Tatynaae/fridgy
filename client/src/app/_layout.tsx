import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, View } from 'react-native';

import { AuthSessionProvider, useAuthSession } from '@/auth/session';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthButton, AuthError, AuthPage, AuthTitle, authLayout } from '@/components/auth/auth-ui';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthSessionProvider>
        <SessionNavigator />
      </AuthSessionProvider>
    </ThemeProvider>
  );
}

function SessionNavigator() {
  const { session, restoring, restoreError, retryRestore } = useAuthSession();

  if (restoring && !restoreError) return null;

  return (
    <>
      {restoreError ? (
        <AuthPage>
          <AuthTitle>Не удалось проверить сессию</AuthTitle>
          <View style={authLayout.form}>
            <AuthError>{restoreError}</AuthError>
            <AuthButton disabled={restoring} onPress={retryRestore}>
              {restoring ? 'Проверяем…' : 'Повторить'}
            </AuthButton>
          </View>
        </AuthPage>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!session}>
            <Stack.Screen name="sign-in" options={{ gestureEnabled: false }} />
            <Stack.Screen name="register" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="reset-password" />
          </Stack.Protected>
          <Stack.Protected guard={Boolean(session)}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>
        </Stack>
      )}
      <AnimatedSplashOverlay />
    </>
  );
}
