import { TamaguiProvider, createTamagui } from "@tamagui/core";
import { Stack } from "expo-router";
import { defaultConfig } from "@tamagui/config/v4";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { LocalizationProvider } from "../contexts/LocalizationContext";

import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

// you usually export this from a tamagui.config.ts file
const config = createTamagui(defaultConfig);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Signatra: require("../assets/fonts/Signatra.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LocalizationProvider>
      <ThemeProvider>
        <AuthProvider>
          <TamaguiProvider config={config}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)/auth" />
            </Stack>
          </TamaguiProvider>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
