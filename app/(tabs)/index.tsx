import { View } from "react-native";
import { Button, Text } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text fontSize={24} fontWeight="bold" color={colors.foreground}>
          Actualités
        </Text>
        <Button
          margin={20}
          borderWidth={1}
          borderColor={colors.primary}
          backgroundColor={colors.primary}
          borderRadius={12}
          height={300}
          onPress={() => router.push("/complete-profil-combined")}
        >
          <Text
            fontSize={40}
            textAlign="center"
            fontWeight="bold"
            color={colors.background}
          >
            Test Page Combinée
          </Text>
        </Button>
        <Button onPress={() => router.push("/profile-completed")}>
          <Text>Completez votre profil (ancien)</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
