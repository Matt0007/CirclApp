import { SafeAreaView } from "react-native";
import { Text } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";

export default function More() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 24,
          fontWeight: "bold",
          color: colors.foreground,
        }}
      >
        More
      </Text>
    </SafeAreaView>
  );
}
