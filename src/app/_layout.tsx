import { useEffect } from "react";

import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AuthProvider } from "@/features/auth/presentation/context/AuthContext";
import { AnimatedSplashOverlay } from "@/shared/components/animated-icon";
import { initializeLocalNotifications } from "@/shared/services/LocalNotificationService";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initializeLocalNotifications();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider
        value={
          colorScheme === "dark"
            ? DarkTheme
            : DefaultTheme
        }
      >
        <AnimatedSplashOverlay />

        <Stack>
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="(protected)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}