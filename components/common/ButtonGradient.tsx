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
  size?: "xs" | "small" | "medium" | "large";
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
      case "xs":
        return { paddingVertical: 6, paddingHorizontal: 12, minWidth: 60 };
      case "small":
        return { paddingVertical: 8, paddingHorizontal: 16, minWidth: 80 };
      case "large":
        return { paddingVertical: 16, paddingHorizontal: 32, minWidth: 140 };
      default: // medium
        return { paddingVertical: 12, paddingHorizontal: 24, minWidth: 100 };
    }
  };

  const getVariantStyles = () => {
    if (variant === "secondary") {
      return {
        backgroundColor: colors.card,
        borderColor: colors.card,
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

  const getShadowStyles = () => {
    if (variant === "secondary") {
      return {
        shadowColor: colors.border,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      };
    }
    return {
      shadowColor: colors.gradientStart,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    };
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
        ...getShadowStyles(),
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
          minHeight: size === "xs" ? 36 : 44, // Hauteur minimale adaptée à la taille
        }}
      >
        {isLoading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <Text
            style={{
              fontSize: size === "xs" ? 14 : 16,
              fontWeight: "bold",
              color: getTextColor(),
              textAlign: "center",
              flexShrink: 1, // Permet au texte de se rétrécir si nécessaire
            }}
            numberOfLines={1} // Force le texte sur une seule ligne
            adjustsFontSizeToFit={true} // Ajuste automatiquement la taille de la police
            minimumFontScale={0.8} // Taille minimale de police (80% de la taille originale)
          >
            {loadingText || title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
