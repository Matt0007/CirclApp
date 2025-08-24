import React, { useState } from "react";
import { TouchableOpacity, TextInput, View } from "react-native";
import { YStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLogin } from "../../../hooks/auth";
import { AlertFormError } from "../../alert";
import { ButtonGradient } from "../../common";

interface LoginFormProps {
  onLoginSuccess: (userData: any) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { colors } = useTheme();
  const { login, isLoading, error, clearError } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleLogin = async () => {
    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (result) {
      onLoginSuccess(result);
    }
  };

  return (
    <YStack space="$4">
      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.mutedForeground as any}
        value={formData.email}
        onChangeText={(text) => updateField("email", text)}
        style={{
          backgroundColor: colors.input,
          borderColor: colors.border,
          color: colors.foreground,
          borderWidth: 1,
          borderRadius: 12,
          fontSize: 16,
          paddingRight: 50,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      />

      <YStack space="$2">
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor={colors.mutedForeground as any}
            value={formData.password}
            onChangeText={(text) => updateField("password", text)}
            secureTextEntry={!showPassword}
            autoComplete="off"
            textContentType="none"
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            style={{
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.foreground,
              borderWidth: 1,
              borderRadius: 12,
              fontSize: 16,
              paddingRight: 50,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 12,
              top: 9,
              padding: 4,
            }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => console.log("Mot de passe oublié")}
          style={{ alignItems: "flex-end" }}
        >
          <Text
            style={{
              color: colors.primary,
              fontSize: 14,
              textDecorationLine: "underline",
              marginRight: 10,
            }}
          >
            Mot de passe oublié ?
          </Text>
        </TouchableOpacity>
      </YStack>

      <AlertFormError error={error} />

      <ButtonGradient
        onPress={handleLogin}
        title="Se connecter"
        isLoading={isLoading}
        disabled={isLoading}
      />
    </YStack>
  );
}
