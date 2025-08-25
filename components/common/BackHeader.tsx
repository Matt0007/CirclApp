import React from "react";
import { XStack, Button, H1, View } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { router } from "expo-router";

interface BackHeaderProps {
  title: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

export const BackHeader: React.FC<BackHeaderProps> = ({
  title,
  onBackPress,
  rightElement,
}) => {
  const { colors } = useTheme();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="$4"
      borderBottomWidth={1}
      borderBottomColor={colors.border}
      backgroundColor={colors.background}

    >
      <Button
      
        size="$3"
        circular
        backgroundColor="transparent"
        onPress={handleBackPress}
        pressStyle={{ backgroundColor: "transparent" }}
        focusStyle={{ backgroundColor: "transparent" }}
        hoverStyle={{ backgroundColor: "transparent" }}
        borderWidth={0}
        outlineColor="transparent"
      >
        <Ionicons name="arrow-back" size={20} color={colors.foreground} />
      </Button>

      <H1 color={colors.foreground} fontSize="$5" fontWeight="bold">
        {title}
      </H1>

      {rightElement || <View width={40} />}
    </XStack>
  );
};
