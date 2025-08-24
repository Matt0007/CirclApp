import React, { useState } from "react";
import {
  ActivityIndicator,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../contexts/ThemeContext";
import { useSendVerification, useRegister } from "../../../hooks/auth";
import { AlertFormError } from "../../alert";
import VerificationModal from "./VerificationModal";

interface RegisterFormProps {
  onRegisterSuccess: (userData: any) => void;
}

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
  const { colors } = useTheme();
  const {
    sendVerification,
    isLoading: sendLoading,
    error: sendError,
    clearError: clearSendError,
  } = useSendVerification();
  const {
    register,
    isLoading: registerLoading,
    error: registerError,
    clearError: clearRegisterError,
  } = useRegister();

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (sendError) clearSendError();
    if (registerError) clearRegisterError();
    if (validationError) setValidationError(null);
  };

  const handleSendVerification = async () => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName
    ) {
      setValidationError("Veuillez remplir tous les champs");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setValidationError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    const result = await sendVerification({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (result) {
      setShowVerificationModal(true);
    }
  };

  const handleVerificationSubmit = async (verificationCode: string) => {
    const result = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      code: verificationCode,
      confirmPassword: formData.confirmPassword,
    });

    if (result) {
      setShowVerificationModal(false);
      onRegisterSuccess(result);
    }
  };

  const currentError = validationError || sendError || registerError;
  const currentLoading = sendLoading || registerLoading;

  return (
    <>
      <YStack space="$4">
        <XStack space="$4">
          <TextInput
            placeholder="Prénom"
            placeholderTextColor={colors.mutedForeground as any}
            value={formData.firstName}
            onChangeText={(text) => updateField("firstName", text)}
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
              flex: 1,
            }}
          />
          <TextInput
            placeholder="Nom"
            placeholderTextColor={colors.mutedForeground as any}
            value={formData.lastName}
            onChangeText={(text) => updateField("lastName", text)}
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
              flex: 1,
            }}
          />
        </XStack>

        <YStack space="$3">
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
          <View style={{ position: "relative" }}>
            <TextInput
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={colors.mutedForeground as any}
              value={formData.confirmPassword}
              onChangeText={(text) => updateField("confirmPassword", text)}
              secureTextEntry={!showConfirmPassword}
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
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={20}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>
        </YStack>

        <AlertFormError error={currentError} />

        <Button
          theme="outlined"
          onPress={handleSendVerification}
          disabled={currentLoading}
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
            {sendLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              "Inscription"
            )}
          </Text>
        </Button>
      </YStack>

      <VerificationModal
        visible={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onSubmit={handleVerificationSubmit}
        onResend={() => {
          // Renvoyer le code de vérification
          sendVerification({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          });
        }}
        isLoading={registerLoading}
        error={registerError}
        onClearError={() => {
          clearRegisterError();
        }}
      />
    </>
  );
}
