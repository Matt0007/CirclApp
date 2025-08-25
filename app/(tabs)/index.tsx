import { SafeAreaView, View } from "react-native";
import { Button, Text } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
        <Text fontSize="24" fontWeight="bold">
          Actualités
        </Text>
      </View>
    </SafeAreaView>
  );
}
