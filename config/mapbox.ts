import Constants from "expo-constants";

// 3. Copiez votre token (commence par pk.)
export const MAPBOX_ACCESS_TOKEN =
  Constants.expoConfig?.extra?.mapboxAccessToken || ""; // Token Mapbox pour Circl

// Styles de carte disponibles pour Mapbox GL JS
export const MAP_STYLES = {
  STREET: "mapbox://styles/mapbox/streets-v12",
  OUTDOORS: "mapbox://styles/mapbox/outdoors-v12",
  LIGHT: "mapbox://styles/mapbox/light-v11",
  DARK: "mapbox://styles/mapbox/dark-v11",
  SATELLITE: "mapbox://styles/mapbox/satellite-v9",
  SATELLITE_STREETS: "mapbox://styles/mapbox/satellite-streets-v12",
  NAVIGATION_DAY: "mapbox://styles/mapbox/navigation-day-v1",
  NAVIGATION_NIGHT: "mapbox://styles/mapbox/navigation-night-v1",
};

// URL de l'API Mapbox
export const MAPBOX_API_URL = "https://api.mapbox.com";

// Fonction pour valider la clé API
export const validateMapboxToken = (token: string): boolean => {
  return Boolean(
    token &&
      token !== "YOUR_MAPBOX_ACCESS_TOKEN_HERE" &&
      token.startsWith("pk.")
  );
};
