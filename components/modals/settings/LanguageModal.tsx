import React from "react";
import { TouchableOpacity, Modal, StatusBar } from "react-native";


interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const LanguageModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
      hardwareAccelerated={true}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          paddingTop: 0,
          paddingBottom: 0,
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e: any) => e.stopPropagation()}
        >
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
