
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
  extra: {
    apiUrl: process.env.API_URL || "http://192.168.1.172:3000"
  }
};
