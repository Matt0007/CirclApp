import React, { useState } from "react";
import { ScrollView, Modal, TouchableOpacity, StatusBar } from "react-native";
import { Text, View, XStack, YStack, H2, ListItem } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import { Ionicons } from "@expo/vector-icons";
import { BackHeader } from "../../components/common/BackHeader";
import LanguageSelector from "../../components/common/LanguageSelector";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { ThemeSelector } from "../../components/settings/ThemeSelector";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { colors, colorScheme } = useTheme();
  const { logout } = useAuth();
  const { t, locale } = useLocalization();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const getLanguageName = (code: string) => {
    return code === "fr" ? "Français" : "English";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <BackHeader title={t("settings")} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack padding="$4" space="$6">
          {/* Section Apparence */}
          <YStack space="$3">
            <H2 color={colors.foreground} fontSize="$4" fontWeight="600">
              {t("theme")}
            </H2>

            <View
              backgroundColor={colors.card}
              borderRadius="$3"
              borderColor={colors.border}
              borderWidth={1}
              overflow="hidden"
            >
              <ListItem
                backgroundColor="transparent"
                paddingVertical="$4"
                paddingHorizontal="$4"
                onPress={() => setShowThemeSelector(true)}
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$3" alignItems="center">
                    <View
                      backgroundColor={colors.accent}
                      borderRadius="$2"
                      padding="$2"
                    >
                      <Ionicons
                        name="color-palette"
                        size={20}
                        color={colors.foreground}
                      />
                    </View>
                    <YStack>
                      <Text
                        color={colors.foreground}
                        fontSize="$4"
                        fontWeight="500"
                      >
                        {t("theme")}
                      </Text>
                      <Text
                        color={colors.mutedForeground}
                        fontSize="$2"
                        marginTop="$1"
                      >
                        {colorScheme === "auto"
                          ? t("automatic")
                          : colorScheme === "dark"
                          ? t("darkMode")
                          : t("lightMode")}
                      </Text>
                    </YStack>
                  </XStack>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </XStack>
              </ListItem>
            </View>
          </YStack>

          {/* Section Langue */}
          <YStack space="$3">
            <H2 color={colors.foreground} fontSize="$4" fontWeight="600">
              {t("language")}
            </H2>

            <View
              backgroundColor={colors.card}
              borderRadius="$3"
              borderColor={colors.border}
              borderWidth={1}
              overflow="hidden"
            >
              <ListItem
                backgroundColor="transparent"
                paddingVertical="$4"
                paddingHorizontal="$4"
                onPress={() => setShowLanguageSelector(true)}
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$3" alignItems="center">
                    <View
                      backgroundColor={colors.accent}
                      borderRadius="$2"
                      padding="$2"
                    >
                      <Ionicons
                        name="language"
                        size={20}
                        color={colors.foreground}
                      />
                    </View>
                    <YStack>
                      <Text
                        color={colors.foreground}
                        fontSize="$4"
                        fontWeight="500"
                      >
                        {t("language")}
                      </Text>
                      <Text
                        color={colors.mutedForeground}
                        fontSize="$2"
                        marginTop="$1"
                      >
                        {getLanguageName(locale)}
                      </Text>
                    </YStack>
                  </XStack>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </XStack>
              </ListItem>
            </View>
          </YStack>

          {/* Section Compte */}
          <YStack space="$3">
            <H2 color={colors.foreground} fontSize="$4" fontWeight="600">
              {t("account")}
            </H2>

            <View
              backgroundColor={colors.card}
              borderRadius="$3"
              borderColor={colors.border}
              borderWidth={1}
              overflow="hidden"
            >
              <ListItem
                backgroundColor="transparent"
                borderBottomWidth={1}
                borderBottomColor={colors.border}
                paddingVertical="$4"
                paddingHorizontal="$4"
                onPress={() => router.push("/(backPage)/edit-profile")}
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$3" alignItems="center">
                    <View
                      backgroundColor={colors.primary}
                      borderRadius="$2"
                      padding="$2"
                    >
                      <Ionicons
                        name="person"
                        size={20}
                        color={colors.primaryForeground}
                      />
                    </View>
                    <YStack>
                      <Text
                        color={colors.foreground}
                        fontSize="$4"
                        fontWeight="500"
                      >
                        {t("editProfile")}
                      </Text>
                      <Text
                        color={colors.mutedForeground}
                        fontSize="$2"
                        marginTop="$1"
                      >
                        {t("editProfile")}
                      </Text>
                    </YStack>
                  </XStack>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </XStack>
              </ListItem>

              <ListItem
                backgroundColor="transparent"
                paddingVertical="$4"
                paddingHorizontal="$4"
                onPress={handleLogout}
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$3" alignItems="center">
                    <View
                      backgroundColor={colors.destructive}
                      borderRadius="$2"
                      padding="$2"
                    >
                      <Ionicons
                        name="log-out"
                        size={20}
                        color={colors.destructiveForeground}
                      />
                    </View>
                    <YStack>
                      <Text
                        color={colors.foreground}
                        fontSize="$4"
                        fontWeight="500"
                      >
                        {t("logout")}
                      </Text>
                      <Text
                        color={colors.mutedForeground}
                        fontSize="$2"
                        marginTop="$1"
                      >
                        {t("logout")}
                      </Text>
                    </YStack>
                  </XStack>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </XStack>
              </ListItem>
            </View>
          </YStack>

          {/* Section Support */}
          <YStack space="$3">
            <H2 color={colors.foreground} fontSize="$4" fontWeight="600">
              Support
            </H2>

            <View
              backgroundColor={colors.card}
              borderRadius="$3"
              borderColor={colors.border}
              borderWidth={1}
              overflow="hidden"
            >
              <ListItem
                backgroundColor="transparent"
                borderBottomWidth={1}
                borderBottomColor={colors.border}
                paddingVertical="$4"
                paddingHorizontal="$4"
                onPress={() => console.log("Help")}
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$3" alignItems="center">
                    <View
                      backgroundColor={colors.accent}
                      borderRadius="$2"
                      padding="$2"
                    >
                      <Ionicons
                        name="help-circle"
                        size={20}
                        color={colors.foreground}
                      />
                    </View>
                    <YStack>
                      <Text
                        color={colors.foreground}
                        fontSize="$4"
                        fontWeight="500"
                      >
                        Aide
                      </Text>
                      <Text
                        color={colors.mutedForeground}
                        fontSize="$2"
                        marginTop="$1"
                      >
                        Centre d&apos; aide et FAQ
                      </Text>
                    </YStack>
                  </XStack>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </XStack>
              </ListItem>

              <ListItem
                backgroundColor="transparent"
                paddingVertical="$4"
                paddingHorizontal="$4"
                onPress={() => console.log("Contact")}
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$3" alignItems="center">
                    <View
                      backgroundColor={colors.accent}
                      borderRadius="$2"
                      padding="$2"
                    >
                      <Ionicons
                        name="mail"
                        size={20}
                        color={colors.foreground}
                      />
                    </View>
                    <YStack>
                      <Text
                        color={colors.foreground}
                        fontSize="$4"
                        fontWeight="500"
                      >
                        Nous contacter
                      </Text>
                      <Text
                        color={colors.mutedForeground}
                        fontSize="$2"
                        marginTop="$1"
                      >
                        Support technique et suggestions
                      </Text>
                    </YStack>
                  </XStack>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.foreground}
                  />
                </XStack>
              </ListItem>
              <ListItem
                backgroundColor="transparent"
                paddingVertical="$4"
                paddingHorizontal="$4"
                onPress={() => router.push("/test")}
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$3" alignItems="center">
                    <View
                      backgroundColor={colors.accent}
                      borderRadius="$2"
                      padding="$2"
                    >
                      <Ionicons
                        name="document-text"
                        size={20}
                        color={colors.foreground}
                      />
                    </View>
                    <YStack>
                      <Text
                        color={colors.foreground}
                        fontSize="$4"
                        fontWeight="500"
                      >
                        Test
                      </Text>
                      <Text
                        color={colors.mutedForeground}
                        fontSize="$2"
                        marginTop="$1"
                      >
                        Test
                      </Text>
                    </YStack>
                  </XStack>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </XStack>
              </ListItem>
            </View>
          </YStack>

          {/* Section Informations */}
          <YStack space="$3">
            <H2 color={colors.foreground} fontSize="$4" fontWeight="600">
              Informations
            </H2>

            <View
              backgroundColor={colors.card}
              borderRadius="$3"
              borderColor={colors.border}
              borderWidth={1}
              overflow="hidden"
            >
              <ListItem
                backgroundColor="transparent"
                borderBottomWidth={1}
                borderBottomColor={colors.border}
                paddingVertical="$4"
                paddingHorizontal="$4"
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text color={colors.foreground} fontSize="$4">
                    Version
                  </Text>
                  <Text
                    color={colors.mutedForeground}
                    fontSize="$3"
                    fontWeight="500"
                  >
                    1.0.0
                  </Text>
                </XStack>
              </ListItem>

              <ListItem
                backgroundColor="transparent"
                paddingVertical="$4"
                paddingHorizontal="$4"
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text color={colors.foreground} fontSize="$4">
                    Développé par
                  </Text>
                  <Text
                    color={colors.mutedForeground}
                    fontSize="$3"
                    fontWeight="500"
                  >
                    Circl Team
                  </Text>
                </XStack>
              </ListItem>
            </View>
          </YStack>

          {/* Espace en bas */}
          <View height={50} />
        </YStack>
      </ScrollView>

      {/* Modal de sélection de langue */}
      <Modal
        visible={showLanguageSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageSelector(false)}
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
          onPress={() => setShowLanguageSelector(false)}
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
            <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal de sélection de thème */}
      <ThemeSelector
        visible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />

      {/* Modal de confirmation de déconnexion */}
      <ConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
        title={t("logout")}
        message={t("logoutConfirm")}
        confirmText={t("logout")}
        cancelText={t("cancel")}
        confirmVariant="destructive"
      />
    </SafeAreaView>
  );
}
