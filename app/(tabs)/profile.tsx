import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Profile() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/auth");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.foreground,
      marginBottom: 32,
      textAlign: "center",
    },
    userInfo: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: colors.border,
      width: "100%",
    },
    userText: {
      fontSize: 16,
      color: colors.cardForeground,
      marginBottom: 8,
    },
    logoutButton: {
      backgroundColor: colors.destructive || "#EF4444",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    logoutButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    themeToggle: {
      marginBottom: 32,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profil</Text>

        <View style={styles.userInfo}>
          <Text style={styles.userText}>
            Nom : {user?.name || "Non défini"}
          </Text>
          <Text style={styles.userText}>Email : {user?.email}</Text>
        </View>
        <View style={styles.themeToggle}>
          <ThemeToggle />
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
