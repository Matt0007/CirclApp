import React from "react";
import { YStack, Text } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";

interface AlertFormErrorProps {
  error: string | null;
  visible?: boolean;
}

export default function AlertFormError({
  error,
  visible = true,
}: AlertFormErrorProps) {
  const { colors } = useTheme();

  if (!error || !visible) {
    return null;
  }

  return (
    <YStack
      backgroundColor="rgba(220, 38, 38, 0.1)"
      padding={16}
      borderRadius={12}
      shadowColor={colors.destructive}
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.2}
      shadowRadius={8}
      elevation={6}
      marginBottom={20}
      width="100%"
    >
      <Text
        color={colors.destructive}
        textAlign="center"
        fontSize={14}
        fontWeight="500"
      >
        {error}
      </Text>
    </YStack>
  );
}
