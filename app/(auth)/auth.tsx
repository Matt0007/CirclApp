import React, { useState } from "react";
import { Button } from "@tamagui/button";
import { XStack, YStack, Text } from "tamagui";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { LoginForm, RegisterForm } from "../../components/form/auth";
import GoogleLogo from "@/components/logo/GoogleLogo";
import FacebookLogo from "@/components/logo/FacebookLogo";

export default function Auth() {
  const { colors } = useTheme();
  const { login: authLogin } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSuccess = async (result: any) => {
    await authLogin({
      id: result.user.id,
      email: result.user.email,
      token: result.token,
    });
    // Rediriger vers les onglets après connexion réussie
    router.replace("/(tabs)");
  };

  const handleRegisterSuccess = async (result: any) => {
    await authLogin({
      id: result.user.id,
      email: result.user.email,
      token: result.token,
    });
    // Rediriger vers les onglets après inscription réussie
    router.replace("/(tabs)");
  };

  const handleGoogleLogin = async () => {
    Alert.alert("Info", "Connexion Google à implémenter");
  };

  const handleFacebookLogin = async () => {
    Alert.alert("Info", "Connexion Facebook à implémenter");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={true}
        >
          <YStack
            flex={1}
            justifyContent="center"
            padding="$5"
            space="$5"
            paddingBottom="$8"
          >
            <YStack alignItems="center" space="$2">
              <Text
                style={{
                  fontSize: 64,
                  fontWeight: "bold",
                  fontFamily: "Signatra",
                  color: colors.primary,
                }}
              >
                Circl
              </Text>

              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: colors.foreground,
                }}
              >
                {isLogin ? "Connexion" : "Inscription"}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: colors.mutedForeground,
                  textAlign: "center",
                }}
              >
                {isLogin ? "Connecte-toi à ton Circl" : "Crée ton compte Circl"}
              </Text>
            </YStack>

            {/* Formulaire dynamique selon le mode */}
            {isLogin ? (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            ) : (
              <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
            )}

            <YStack space="$4">
              <XStack alignItems="center" justifyContent="center" space="$2">
                <View
                  style={{ flex: 1, height: 1, backgroundColor: colors.border }}
                />
                <Text
                  style={{
                    marginHorizontal: 15,
                    color: colors.mutedForeground,
                  }}
                >
                  ou
                </Text>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: colors.border }}
                />
              </XStack>

              <Button
                theme="outlined"
                onPress={handleGoogleLogin}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                color="#000000"
              >
                <GoogleLogo width={24} height={24} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#525252",
                  }}
                >
                  {isLogin
                    ? "Se connecter avec Google"
                    : "S'inscrire avec Google"}
                </Text>
              </Button>

              <Button
                theme="outlined"
                onPress={handleFacebookLogin}
                style={{
                  backgroundColor: "#1877F2",
                  borderColor: "#1877F2",
                  borderWidth: 1,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                color="#FFFFFF"
              >
                <FacebookLogo width={24} height={24} />
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#FFFFFF",
                  }}
                >
                  {isLogin
                    ? "Se connecter avec Facebook"
                    : "S'inscrire avec Facebook"}
                </Text>
              </Button>
            </YStack>

            <XStack alignItems="center" justifyContent="center" space="$1">
              <Text style={{ color: colors.mutedForeground }}>
                {isLogin ? "Pas encore inscrit ?" : "Déjà inscrit ?"}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={{ color: colors.primary, fontWeight: "600" }}>
                  {isLogin ? "Inscrivez-vous" : "Se connecter"}
                </Text>
              </TouchableOpacity>
            </XStack>

            {/* Mentions RGPD */}
            <YStack alignItems="center" space="$2" paddingTop="$2">
              <Text
                style={{
                  fontSize: 12,
                  color: colors.mutedForeground,
                  textAlign: "center",
                  lineHeight: 16,
                }}
              >
                En continuant, vous acceptez nos{" "}
                <Text
                  style={{
                    color: colors.primary,
                    textDecorationLine: "underline",
                  }}
                >
                  Conditions d&apos;utilisation
                </Text>{" "}
                et notre{" "}
                <Text
                  style={{
                    color: colors.primary,
                    textDecorationLine: "underline",
                  }}
                >
                  Politique de confidentialité
                </Text>
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.mutedForeground,
                  textAlign: "center",
                  opacity: 0.8,
                }}
              >
                Vos données sont protégées conformément au RGPD
              </Text>
            </YStack>
          </YStack>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
