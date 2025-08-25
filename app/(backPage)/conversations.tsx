import { SafeAreaView, View } from "react-native";
import { Text } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { BackHeader } from "../../components/common/BackHeader";

export default function Conversations() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <BackHeader title="Conversations" />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
        }}
      >
        <Text
          fontSize={20}
          fontWeight="600"
          color={colors.foreground}
          textAlign="center"
        >
          Page Conversations
        </Text>

        <Text
          fontSize={16}
          color={colors.mutedForeground}
          textAlign="center"
          marginTop={12}
        >
          Fonctionnalité en cours de développement
        </Text>
      </View>
    </SafeAreaView>
  );
}
