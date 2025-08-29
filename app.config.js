
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
  updates: {
    url: "https://u.expo.dev/48bed89c-0471-40fc-aebd-7db3bd151a96"
  },
  runtimeVersion: {
    policy: "appVersion"
  },
  extra: {
    apiUrl: process.env.API_URL || "https://circlapi-production.up.railway.app",
    eas: {
      projectId: "48bed89c-0471-40fc-aebd-7db3bd151a96"
    }
  }
};
