import React from "react";
import { View, TouchableOpacity, Modal } from "react-native";
import { YStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import { ColorScheme } from "../../types";

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  visible,
  onClose,
}) => {
  const { colors, colorScheme, setColorScheme } = useTheme();
  const { t } = useLocalization();

  const themes = [
    {
      id: "auto" as ColorScheme,
      title: t("automatic"),
      subtitle: t("followSystem"),
      icon: "settings-outline",
    },
    {
      id: "light" as ColorScheme,
      title: t("lightMode"),
      subtitle: t("lightMode"),
      icon: "sunny-outline",
    },
    {
      id: "dark" as ColorScheme,
      title: t("darkMode"),
      subtitle: t("darkMode"),
      icon: "moon-outline",
    },
  ];

  const handleThemeSelect = (theme: ColorScheme) => {
    setColorScheme(theme);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: 20,
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.background,
            borderRadius: 20,
            padding: 24,
            width: "100%",
            maxWidth: 400,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
            position: "relative",
          }}
        >
          {/* Header avec titre et bouton fermer */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: colors.foreground,
              }}
            >
              {t("selectTheme")}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="close" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <YStack space="$3" width="100%">
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                onPress={() => handleThemeSelect(theme.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor:
                    colorScheme === theme.id ? colors.primary : colors.border,
                  backgroundColor:
                    colorScheme === theme.id
                      ? colors.primary + "20"
                      : colors.card,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor:
                      colorScheme === theme.id ? colors.primary : colors.muted,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons
                    name={theme.icon as any}
                    size={20}
                    color={
                      colorScheme === theme.id
                        ? colors.primaryForeground
                        : colors.mutedForeground
                    }
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    fontSize={16}
                    fontWeight="600"
                    color={
                      colorScheme === theme.id
                        ? colors.primary
                        : colors.foreground
                    }
                  >
                    {theme.title}
                  </Text>
                  <Text
                    fontSize={14}
                    color={colors.mutedForeground}
                    marginTop={2}
                  >
                    {theme.subtitle}
                  </Text>
                </View>

                {colorScheme === theme.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </YStack>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
