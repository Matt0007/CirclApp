import { TamaguiProvider, createTamagui } from "@tamagui/core";
import { Stack } from "expo-router";
import { defaultConfig } from "@tamagui/config/v4";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { LocalizationProvider } from "../contexts/LocalizationContext";

import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Platform, View, StatusBar } from "react-native";

// you usually export this from a tamagui.config.ts file
const config = createTamagui(defaultConfig);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { colors, colorScheme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        // Transition fluide pour Android
        ...(Platform.OS === "android" && {
          transition: "background-color 0.3s ease-in-out",
        }),
      }}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          // Configuration pour éviter les pages blanches sur Android
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)/auth" />
      </Stack>
    </View>
  );
}

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
            <AppContent />
          </TamaguiProvider>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
