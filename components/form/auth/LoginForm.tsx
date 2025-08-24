import React, { useState } from "react";
import {
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  View,
} from "react-native";
import { YStack, Text, Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../contexts/ThemeContext";
import { useLogin } from "../../../hooks/auth";
import { AlertFormError } from "../../alert";

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
              right: 16,
              top: 12,
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

      <Button
        theme="outlined"
        onPress={handleLogin}
        disabled={isLoading}
        style={{
          borderWidth: 0,
          borderRadius: 12,
          overflow: "hidden",
        }}
        color="#FFFFFF"
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#FFFFFF" }}>
          {isLoading ? <ActivityIndicator color="#FFFFFF" /> : "Se connecter"}
        </Text>
      </Button>
    </YStack>
  );
}
