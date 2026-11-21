import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import AuthFlow from '@/components/auth/auth-flow';
import WelcomeScreen from '@/components/auth/welcome-screen';
import { AuthProvider, useAuth } from '@/context/auth';

SplashScreen.preventAutoHideAsync();

function Gate() {
  const { status, showWelcome, dismissWelcome } = useAuth();
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  // пока читаем токены, экран входа не показываем, чтобы он не мелькал
  if (status === 'loading' || !fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#F6FAFC' }} />;
  }
  if (status === 'unauthenticated') return <AuthFlow />;
  if (showWelcome) return <WelcomeScreen onStart={dismissWelcome} />;
  return <AppTabs />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <Gate />
      </AuthProvider>
    </ThemeProvider>
  );
}