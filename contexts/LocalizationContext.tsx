import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import locales, { Locale, TranslationKeys } from "../locales";

interface LocalizationContextType {
  locale: Locale;
  t: (key: TranslationKeys) => string;
  changeLocale: (newLocale: Locale) => void;
  detectDeviceLanguage: () => void;
  useDeviceLanguage: boolean;
  isRTL: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined
);

const LOCALE_STORAGE_KEY = "@locale";

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }
  return context;
};

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
}) => {
  const [locale, setLocale] = useState<Locale>("en");
  const [useDeviceLanguage, setUseDeviceLanguage] = useState<boolean>(true);

  // Debug: Log every time locale changes
  useEffect(() => {
    console.log("LocalizationProvider: Locale changed to", locale);
  }, [locale]);

  useEffect(() => {
    console.log("🚀 LocalizationProvider: App starting, loading locale...");
    loadSavedLocale();
  }, []);

  const loadSavedLocale = async () => {
    try {
      console.log("🔍 Loading locale...");

      // Check if user wants to use device language or manual choice
      const savedUseDeviceLanguage = await AsyncStorage.getItem(
        "@useDeviceLanguage"
      );
      const savedManualLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);

      console.log("📱 Saved useDeviceLanguage:", savedUseDeviceLanguage);
      console.log("📱 Saved manual locale:", savedManualLocale);

      if (savedUseDeviceLanguage === "false" && savedManualLocale) {
        // User wants manual choice and has a saved language
        console.log("✅ Using saved manual language:", savedManualLocale);
        setUseDeviceLanguage(false);
        setLocale(savedManualLocale as Locale);
      } else {
        // Use device language (default or user preference)
        console.log("🌍 Using device language detection...");
        setUseDeviceLanguage(true);

        const deviceLocales = Localization.getLocales();
        console.log("📱 All device locales:", deviceLocales);

        const deviceLocale = deviceLocales[0]?.languageCode;
        console.log("🌍 Primary device language code:", deviceLocale);

        let selectedLocale: Locale;

        if (deviceLocale === "fr") {
          console.log("🇫🇷 Device is in French, setting app to French");
          selectedLocale = "fr";
        } else {
          console.log("🇺🇸 Device is not in French, setting app to English");
          selectedLocale = "en";
        }

        setLocale(selectedLocale);
      }
    } catch (error) {
      console.error("❌ Error loading locale:", error);
      setLocale("en");
    }
  };

  const changeLocale = async (newLocale: Locale) => {
    try {
      console.log("Changing locale from", locale, "to", newLocale);

      // Set to manual mode
      setUseDeviceLanguage(false);
      await AsyncStorage.setItem("@useDeviceLanguage", "false");

      // Save the manual language choice
      try {
        await AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
        console.log("💾 Saved manual language choice:", newLocale);
      } catch (storageError) {
        console.error("❌ AsyncStorage error:", storageError);
      }

      // Update the locale
      setLocale(newLocale);
      console.log("✅ Locale changed successfully to", newLocale);
    } catch (error) {
      console.error("❌ Error in changeLocale:", error);
    }
  };

  const t = (key: TranslationKeys): string => {
    const translation = locales[locale][key] || key;
    console.log(`Translation for "${key}" in ${locale}: "${translation}"`);
    return translation;
  };

  const isRTL = false; // French and English are LTR languages

  const detectDeviceLanguage = async () => {
    try {
      console.log("🔄 Activating device language detection...");

      // Set to automatic mode
      setUseDeviceLanguage(true);
      await AsyncStorage.setItem("@useDeviceLanguage", "true");

      // Remove manual language choice
      await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);

      // Detect and set device language
      const deviceLocales = Localization.getLocales();
      const deviceLocale = deviceLocales[0]?.languageCode;

      let selectedLocale: Locale;
      if (deviceLocale === "fr") {
        selectedLocale = "fr";
        console.log("🇫🇷 Device language detected: French");
      } else {
        selectedLocale = "en";
        console.log("🇺🇸 Device language detected: English");
      }

      setLocale(selectedLocale);
      console.log("✅ Switched to device language:", selectedLocale);
    } catch (error) {
      console.error("❌ Error in detectDeviceLanguage:", error);
    }
  };

  const value: LocalizationContextType = {
    locale,
    t,
    changeLocale,
    detectDeviceLanguage,
    useDeviceLanguage,
    isRTL,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
