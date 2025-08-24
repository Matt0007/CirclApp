import { useColorScheme } from "react-native";

// Couleurs Light Theme (converties depuis vos valeurs OKLCH)
export const lightColors = {
  background: "#F0F1F4", // oklch(0.9383 0.0042 236.4993)
  foreground: "#525252", // oklch(0.3211 0 0)
  card: "#FFFFFF", // oklch(1.0000 0 0)
  cardForeground: "#525252", // oklch(0.3211 0 0)
  popover: "#FFFFFF", // oklch(1.0000 0 0)
  popoverForeground: "#525252", // oklch(0.3211 0 0)
  primary: "#FF6B35", // Orange vibrant et chaleureux
  primaryForeground: "#FFFFFF", // oklch(1.0000 0 0)
  secondary: "#F7F7FA", // oklch(0.9670 0.0029 264.5419)
  secondaryForeground: "#6B7280", // oklch(0.4461 0.0263 256.8018)
  muted: "#FBFBFC", // oklch(0.9846 0.0017 247.8389)
  mutedForeground: "#8B8B8B", // oklch(0.5510 0.0234 264.3637)
  accent: "#E8E9F0", // oklch(0.9119 0.0222 243.8174)
  accentForeground: "#6B7280", // oklch(0.3791 0.1378 265.5222)
  destructive: "#DC2626", // oklch(0.6368 0.2078 25.3313)
  destructiveForeground: "#FFFFFF", // oklch(1.0000 0 0)
  border: "#E5E7EB", // oklch(0.9022 0.0052 247.8822)
  input: "#F7F7FA", // oklch(0.9700 0.0029 264.5420)
  ring: "#FF6B35", // Orange vibrant et chaleureux
  chart1: "#B8B8C0", // oklch(0.7156 0.0605 248.6845)
  chart2: "#C8C8A0", // oklch(0.7875 0.0917 35.9616)
  chart3: "#A0A0C0", // oklch(0.5778 0.0759 254.1573)
  chart4: "#8080A0", // oklch(0.5016 0.0849 259.4902)
  chart5: "#606080", // oklch(0.4241 0.0952 264.0306)
  sidebar: "#E6E7F0", // oklch(0.9030 0.0046 258.3257)
  sidebarForeground: "#525252", // oklch(0.3211 0 0)
  sidebarPrimary: "#FF6B35", // Orange vibrant et chaleureux
  sidebarPrimaryForeground: "#FFFFFF", // oklch(1.0000 0 0)
  sidebarAccent: "#E8E9F0", // oklch(0.9119 0.0222 243.8174)
  sidebarAccentForeground: "#6B7280", // oklch(0.3791 0.1378 265.5222)
  sidebarBorder: "#EDEDF0", // oklch(0.9276 0.0058 264.5313)
  sidebarRing: "#FF6B35", // Orange vibrant et chaleureux
  // Couleurs de dégradé pour les boutons
  gradientStart: "#FFB347", // Orange clair pour le début du dégradé
  gradientEnd: "#FF6B35", // Orange plus foncé pour la fin du dégradé
};

// Couleurs Dark Theme (converties depuis vos valeurs OKLCH)
export const darkColors = {
  background: "#1C1C1E", // Gris très sombre neutre qui s'harmonise avec l'orange
  foreground: "#F5F5F5", // Blanc cassé pour un meilleur contraste
  card: "#2A2A2C", // Gris plus clair que le background pour la hiérarchie
  cardForeground: "#F5F5F5", // Blanc cassé pour la lisibilité
  popover: "#2A2A2C", // Même couleur que card pour la cohérence
  popoverForeground: "#F5F5F5", // Blanc cassé pour la lisibilité
  primary: "#FF6B35", // Orange vibrant et chaleureux
  primaryForeground: "#FFFFFF", // Blanc pur pour le contraste
  secondary: "#3A3A3C", // Gris intermédiaire pour les éléments secondaires
  secondaryForeground: "#E5E5E5", // Gris clair pour le texte secondaire
  muted: "#2A2A2C", // Même couleur que card
  mutedForeground: "#A0A0A0", // Gris moyen pour le texte atténué
  accent: "#3A3A3C", // Même couleur que secondary
  accentForeground: "#E5E5E5", // Gris clair pour l'accent
  destructive: "#EF4444", // Rouge plus vif qui s'harmonise avec l'orange
  destructiveForeground: "#FFFFFF", // Blanc pur pour le contraste
  border: "#3A3A3C", // Même couleur que secondary pour la cohérence
  input: "#2A2A2C", // Même couleur que card
  ring: "#FF6B35", // Orange vibrant et chaleureux
  chart1: "#3A3A3C", // Gris cohérent avec secondary
  chart2: "#4A4A4C", // Gris plus clair pour la variété
  chart3: "#2A2A2C", // Gris plus sombre pour la variété
  chart4: "#5A5A5C", // Gris intermédiaire
  chart5: "#1A1A1C", // Gris très sombre pour la variété
  sidebar: "#2A2A2C", // Même couleur que card
  sidebarForeground: "#F5F5F5", // Blanc cassé cohérent
  sidebarPrimary: "#FF6B35", // Orange vibrant et chaleureux
  sidebarPrimaryForeground: "#FFFFFF", // Blanc pur pour le contraste
  sidebarAccent: "#3A3A3C", // Même couleur que secondary
  sidebarAccentForeground: "#E5E5E5", // Gris clair cohérent
  sidebarBorder: "#3A3A3C", // Même couleur que secondary
  sidebarRing: "#FF6B35", // Orange vibrant et chaleureux
  // Couleurs de dégradé pour les boutons
  gradientStart: "#FFB347", // Orange clair pour le début du dégradé
  gradientEnd: "#FF6B35", // Orange plus foncé pour la fin du dégradé
};

// Hook personnalisé pour utiliser les couleurs selon le thème
export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? darkColors : lightColors;
};
