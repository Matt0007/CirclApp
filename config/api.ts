import Constants from "expo-constants";

// Configuration API - Récupère l'URL depuis app.config.js
export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || "https://60f368bf1369.ngrok-free.app";

// Fallback vers l'URL par défaut si pas de configuration
export const getApiUrl = () => {
  return API_BASE_URL;
};
