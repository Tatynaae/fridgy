import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/context/auth-context';

SplashScreen.preventAutoHideAsync();

const AUTH_ROUTES = ['login', 'register', 'forgot-password', 'reset-password'];

// Не авторизован -> /login, авторизован на экране входа -> главная
function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const inAuth = AUTH_ROUTES.includes(segments[0] ?? '');

  useEffect(() => {
    if (loading) return;
    if (!user && !inAuth) router.replace('/login');
    else if (user && inAuth) router.replace('/');
  }, [user, loading, inAuth, router]);

  return <>{children}</>;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthGate>
          <AnimatedSplashOverlay />
          <AppTabs />
        </AuthGate>
      </AuthProvider>
    </ThemeProvider>
  );
}
