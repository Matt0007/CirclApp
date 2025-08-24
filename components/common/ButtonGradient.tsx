import React from "react";
import { TouchableOpacity, View, ActivityIndicator, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";

interface ButtonGradientProps {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
}

export default function ButtonGradient({
  onPress,
  title,
  isLoading = false,
  disabled = false,
  loadingText,
  variant = "primary",
  size = "medium",
}: ButtonGradientProps) {
  const { colors } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case "large":
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default: // medium
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  const getVariantStyles = () => {
    if (variant === "secondary") {
      return {
        backgroundColor: "transparent",
        borderColor: colors.border,
        borderWidth: 1,
      };
    }
    return {};
  };

  const getTextColor = () => {
    if (variant === "secondary") {
      return colors.foreground;
    }
    return "#FFFFFF";
  };

  const getGradientColors = () => {
    if (variant === "secondary") {
      return ["transparent", "transparent"];
    }
    return [colors.gradientStart, colors.gradientEnd];
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={{
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        opacity: disabled ? 0.6 : 1,
        ...getVariantStyles(),
      }}
      activeOpacity={0.8}
    >
      {variant === "primary" && (
        <LinearGradient
          colors={getGradientColors() as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            borderRadius: 12,
          }}
        />
      )}
      <View
        style={{
          ...getSizeStyles(),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: getTextColor(),
            }}
          >
            {loadingText || title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
