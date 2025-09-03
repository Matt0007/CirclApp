import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CountryFlag from "react-native-country-flag";
import { useLocalization } from "../../contexts/LocalizationContext";
import { Locale } from "../../locales";
import { useTheme } from "../../contexts/ThemeContext";

interface LanguageSelectorProps {
  onClose?: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onClose }) => {
  const { locale, changeLocale, detectDeviceLanguage, t } = useLocalization();
  const { colors } = useTheme();

  // Get the current mode from the context
  const { useDeviceLanguage } = useLocalization();

  const languages = [
    { code: "en" as Locale, name: "English", countryCode: "GB" },
    { code: "fr" as Locale, name: "Français", countryCode: "FR" },
  ];

  const handleLanguageChange = (newLocale: Locale) => {
    changeLocale(newLocale);
    onClose?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header avec titre et bouton fermer */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t("language")}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {/* Section mode automatique */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          {t("automaticMode")}
        </Text>
        <TouchableOpacity
          style={[
            styles.deviceLanguageCard,
            { borderColor: colors.border },
            { backgroundColor: colors.card },
            useDeviceLanguage && {
              borderColor: colors.primary,
              backgroundColor: colors.primary + "10",
            },
          ]}
          onPress={() => {
            detectDeviceLanguage();
            onClose?.();
          }}
        >
          <View style={styles.cardContent}>
            <View style={styles.phoneIcon}>
              <Ionicons
                name="phone-portrait"
                size={32}
                color={colors.primary}
              />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                {t("useDeviceLanguage")}
              </Text>
              <Text
                style={[styles.cardSubtitle, { color: colors.mutedForeground }]}
              >
                {t("automaticModeDescription")}
              </Text>
            </View>
            {useDeviceLanguage && (
              <View
                style={[
                  styles.checkmarkContainer,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="checkmark" size={18} color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Section langues manuelles */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          {t("fixedLanguage")}
        </Text>
        <View style={styles.languagesGrid}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageCard,
                { borderColor: colors.border },
                { backgroundColor: colors.card },
                locale === language.code &&
                  !useDeviceLanguage && {
                    borderColor: colors.primary,
                    backgroundColor: colors.primary + "10",
                  },
              ]}
              onPress={() => handleLanguageChange(language.code)}
            >
              <CountryFlag isoCode={language.countryCode} size={24} />
              <Text style={[styles.languageName, { color: colors.foreground }]}>
                {language.name}
              </Text>
              {locale === language.code && !useDeviceLanguage && (
                <View
                  style={[
                    styles.languageCheckmarkContainer,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    maxWidth: 500,
    backgroundColor: "transparent",
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  deviceLanguageCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  languagesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  languageCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    minHeight: 100,
    justifyContent: "center",
  },
  flagContainer: {
    marginBottom: 8,
    alignItems: "center",
  },
  phoneIcon: {
    marginBottom: 8,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  checkmarkContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  languageCheckmarkContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LanguageSelector;
