import { ActivityIndicator, View } from "react-native";
import { Button, Text } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
      {/* Conteneur pour positionner le bouton à droite */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Button
          onPress={() => router.push("/(backPage)/conversations")}
          backgroundColor={colors.primary}
          borderRadius={12}
          paddingHorizontal={16}
          paddingVertical={8}
          flexDirection="row"
          alignItems="center"
          gap={8}
        >
          <Ionicons name="chatbubbles" size={20} color="white" />
        </Button>
      </View>

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

      </View>
    </SafeAreaView>
  );
}
