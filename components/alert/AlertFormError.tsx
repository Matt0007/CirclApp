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
      backgroundColor={`${colors.destructive}10`}
      padding={16}
      borderRadius={12}
      marginBottom={20}
      width="100%"
    >
      <Text
        backgroundColor="transparent"
        color={colors.destructive}
        textAlign="center"
        fontSize={13.5}
        fontWeight="500"
      >
        {error}
      </Text>
    </YStack>
  );
}
