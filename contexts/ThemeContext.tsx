import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightColors, darkColors } from "../utils/colors";
import { ColorScheme, ThemeColors } from "../types";

interface ThemeContextType {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  toggleTheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = "@theme";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>("auto");

  // Charger le thème sauvegardé au démarrage
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setColorScheme(savedTheme as ColorScheme);
      }
    } catch (error) {
      console.error("❌ Error loading theme:", error);
    }
  };

  // Sauvegarder le thème quand il change
  const saveTheme = async (theme: ColorScheme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("❌ Error saving theme:", error);
    }
  };

  // Déterminer les couleurs en fonction du mode
  const getCurrentColorScheme = (): "light" | "dark" => {
    if (colorScheme === "auto") {
      return systemColorScheme || "light";
    }
    return colorScheme;
  };

  const colors = getCurrentColorScheme() === "dark" ? darkColors : lightColors;

  const toggleTheme = () => {
    setColorScheme((prev) => {
      const newTheme =
        prev === "auto" ? "light" : prev === "light" ? "dark" : "auto";
      saveTheme(newTheme);
      return newTheme;
    });
  };

  const updateColorScheme = (scheme: ColorScheme) => {
    setColorScheme(scheme);
    saveTheme(scheme);
  };

  const value: ThemeContextType = {
    colorScheme,
    colors,
    toggleTheme,
    setColorScheme: updateColorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
