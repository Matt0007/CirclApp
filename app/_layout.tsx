import { TamaguiProvider, createTamagui } from "@tamagui/core";
import { Stack } from "expo-router";
import { defaultConfig } from "@tamagui/config/v4";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";

// you usually export this from a tamagui.config.ts file
const config = createTamagui(defaultConfig);

export default function RootLayout() {
  return (
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
  );
}
