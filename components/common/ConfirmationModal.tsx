import React from "react";
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Text } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import ButtonGradient from "./ButtonGradient";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "destructive";
  isLoading?: boolean;
}

const { width: screenWidth } = Dimensions.get("window");

export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmVariant = "primary",
  isLoading = false,
}: ConfirmationModalProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: colors.background },
              ]}
            >
              {/* Contenu */}
              <View style={styles.content}>
                <Text style={[styles.title, { color: colors.foreground }]}>
                  {title}
                </Text>
                <Text
                  style={[styles.message, { color: colors.mutedForeground }]}
                >
                  {message}
                </Text>
              </View>

              {/* Boutons */}
              <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                  <ButtonGradient
                    title={cancelText || t("cancel")}
                    onPress={onClose}
                    variant="secondary"
                    size="medium"
                    disabled={isLoading}
                  />
                </View>
                <View style={styles.buttonWrapper}>
                  <ButtonGradient
                    title={confirmText || t("confirm")}
                    onPress={handleConfirm}
                    variant={
                      confirmVariant === "destructive" ? "primary" : "primary"
                    }
                    size="medium"
                    isLoading={isLoading}
                    disabled={isLoading}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: screenWidth - 40,
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  content: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 32,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
});
