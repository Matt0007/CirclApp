import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { colorScheme, toggleTheme, colors } = useTheme();

  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.accent,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    text: {
      color: colors.accentForeground,
      fontSize: 14,
      fontWeight: "600",
    },
  });

  return (
    <TouchableOpacity style={styles.button} onPress={toggleTheme}>
      <Text style={styles.text}>
        {colorScheme === "light" ? "🌙" : "☀️"}
        {colorScheme === "light" ? " Sombre" : " Clair"}
      </Text>
    </TouchableOpacity>
  );
};
