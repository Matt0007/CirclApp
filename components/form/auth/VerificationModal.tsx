import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { YStack, Text, Button } from "tamagui";
import { useTheme } from "../../../contexts/ThemeContext";
import { AlertFormError } from "../../alert";
import CodeInput from "./CodeInput";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  onResend?: () => void;
  isLoading: boolean;
  error: string | null;
  onClearError?: () => void;
}

export default function VerificationModal({
  visible,
  onClose,
  onSubmit,
  onResend,
  isLoading,
  error,
  onClearError,
}: VerificationModalProps) {
  const { colors } = useTheme();
  const [verificationCode, setVerificationCode] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Gérer le countdown pour éviter le spam
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Plus besoin de useEffect, le CodeInput gère automatiquement la soumission

  const handleCodeChange = (text: string) => {
    setVerificationCode(text);
    // Réinitialiser le flag pour permettre une nouvelle vérification
    if (hasSubmitted) {
      setHasSubmitted(false);
    }
  };

  const handleClose = () => {
    setVerificationCode("");
    setHasSubmitted(false);
    if (onClearError) {
      onClearError();
    }
    onClose();
  };

  const handleResend = () => {
    if (onResend) {
      onResend();
      setCountdown(60); // 60 secondes = 1 minute
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingTop:
              Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
          }}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 24,
                margin: 20,
                width: "90%",
                maxWidth: 400,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <YStack space="$4" alignItems="center">
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: colors.foreground,
                    textAlign: "center",
                  }}
                >
                  Code de vérification
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: colors.mutedForeground,
                    textAlign: "center",
                    lineHeight: 22,
                  }}
                >
                  Nous avons envoyé un code de vérification à votre adresse
                  email. La vérification se fera automatiquement une fois les 6
                  chiffres saisis.
                </Text>

                <CodeInput
                  length={6}
                  value={verificationCode}
                  onChangeText={handleCodeChange}
                  onComplete={(code) => {
                    if (!isLoading && !hasSubmitted) {
                      setHasSubmitted(true);
                      onSubmit(code);
                    }
                  }}
                  onBlur={() => {
                    // Fermer le clavier mais ne pas fermer la modal
                    Keyboard.dismiss();
                  }}
                />

                <AlertFormError error={error} />

                <YStack space="$3" width="100%">
                  <Button
                    theme="outlined"
                    onPress={handleResend}
                    disabled={isLoading || countdown > 0}
                    style={{
                      backgroundColor:
                        countdown > 0 ? "#cccccc" : colors.primary,
                      borderColor: countdown > 0 ? "#cccccc" : colors.primary,
                      borderWidth: 1,
                      borderRadius: 12,
                      opacity: countdown > 0 ? 0.7 : 1,
                    }}
                    color="#FFFFFF"
                  >
                    <Text style={{ fontWeight: "600", color: "#FFFFFF" }}>
                      {countdown > 0
                        ? `Renvoyer dans ${Math.floor(countdown / 60)}:${(
                            countdown % 60
                          )
                            .toString()
                            .padStart(2, "0")}`
                        : "Renvoyer le code"}
                    </Text>
                  </Button>

                  <Button
                    theme="outlined"
                    onPress={handleClose}
                    disabled={isLoading}
                    style={{
                      backgroundColor: "transparent",
                      borderColor: colors.border,
                      borderWidth: 1,
                      borderRadius: 12,
                    }}
                    color={colors.foreground}
                  >
                    <Text
                      style={{ color: colors.foreground, fontWeight: "500" }}
                    >
                      Annuler
                    </Text>
                  </Button>
                </YStack>
              </YStack>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
