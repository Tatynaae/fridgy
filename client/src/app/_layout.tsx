import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { Stack, useRouter, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { AnimatedSplashOverlay } from "@/components/animated-icon";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        if (!active) return;

        const isAuthRoute =
          pathname === "/login" || pathname === "/register";

        if (!token && !isAuthRoute) {
          router.replace("/login");
        } else if (token && isAuthRoute) {
          router.replace("/");
        }
      } catch (error) {
        console.error("Ошибка проверки авторизации:", error);
      } finally {
        if (active) setCheckingAuth(false);
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, [router, pathname]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />

      {checkingAuth ? null : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      )}
    </ThemeProvider>
  );
}