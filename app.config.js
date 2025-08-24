
export default {
  name: "Circl App",
  slug: "circl-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  scheme: "circlapp",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#D97706"
  },
  extra: {
    apiUrl: process.env.API_URL || "https://60f368bf1369.ngrok-free.app"
  }
};
