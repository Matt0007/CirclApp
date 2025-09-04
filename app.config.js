
export default {
  name: "Circl App",
  slug: "circl-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  scheme: "circlapp",
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#D97706"
  },
  android: {
    backgroundColor: "#1C1C1E", // Couleur de fond par défaut pour le mode sombre
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#1C1C1E"
    },
    // Configuration pour éviter les pages blanches
    navigationBarColor: "#1C1C1E",
  },
  ios: {
    backgroundColor: "#1C1C1E", // Couleur de fond par défaut pour le mode sombre
    supportsTablet: true
  },
  updates: {
    url: "https://u.expo.dev/48bed89c-0471-40fc-aebd-7db3bd151a96"
  },
  runtimeVersion: {
    policy: "appVersion"
  },
  extra: {
    apiUrl: process.env.API_URL,
    mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
    imageSecretToken: process.env.IMAGE_SECRET_TOKEN,
    eas: {
      projectId: "48bed89c-0471-40fc-aebd-7db3bd151a96"
    }
  }
};
