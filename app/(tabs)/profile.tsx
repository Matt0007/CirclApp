import React from "react";
import { Text, View, XStack, Button } from "tamagui";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { UserProfile } from "@/components/common";

export default function Profile() {
  const { colors } = useTheme();
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const insets = useSafeAreaInsets();
  const [isNavigating, setIsNavigating] = React.useState(false);

  // Refresh des données quand on arrive sur le profil
  useFocusEffect(
    React.useCallback(() => {
      if (isAuthenticated) {
        console.log("🔄 Refresh des données utilisateur...");
        refreshUserData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])
  );

  // Fonction pour naviguer avec protection contre les clics multiples
  const handleNavigation = (route: string) => {
    if (isNavigating) return;

    setIsNavigating(true);
    router.push(route);

    // Réactiver après un délai
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

  // Rediriger vers la page d'authentification si l'utilisateur n'est pas connecté
  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View flex={1} justifyContent="center" alignItems="center" padding="$4">
          <Text color={colors.foreground} fontSize="$5" marginBottom="$4">
            Veuillez vous connecter pour voir votre profil
          </Text>
          <Button
            backgroundColor={colors.primary}
            color={colors.primaryForeground}
            onPress={() => router.push("/(auth)/auth")}
          >
            Se connecter
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      {/* Header fixe avec nom et boutons d'action */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$2"
        backgroundColor={colors.background}
      >
        {/* Nom complet */}
        <View flex={1}>
          <Text
            color={colors.foreground}
            fontSize="$7"
            fontWeight="800"
            numberOfLines={1}
          >
            {user.firstName} {user.lastName}
          </Text>
        </View>

        {/* Boutons d'action */}
        <XStack space="$3" alignItems="center">
          <Button
            size="$3"
            circular
            backgroundColor="transparent"
            focusStyle={{ backgroundColor: "transparent" }}
            hoverStyle={{ backgroundColor: "transparent" }}
            pressStyle={{ backgroundColor: "transparent" }}
            borderWidth={0}
            outlineColor="transparent"
            disabled={isNavigating}
            opacity={isNavigating ? 0.5 : 1}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.foreground}
            />
          </Button>
          <Button
            size="$3"
            circular
            backgroundColor="transparent"
            focusStyle={{ backgroundColor: "transparent" }}
            hoverStyle={{ backgroundColor: "transparent" }}
            pressStyle={{ backgroundColor: "transparent" }}
            borderWidth={0}
            outlineColor="transparent"
            onPress={() => handleNavigation("/(backPage)/settings")}
            disabled={isNavigating}
            opacity={isNavigating ? 0.5 : 1}
          >
            <Ionicons name="menu" size={24} color={colors.foreground} />
          </Button>
        </XStack>
      </XStack>

      {/* Contenu du profil utilisant le composant réutilisable */}
      <UserProfile
        user={user}
        isOwnProfile={true}
        postsCount={0}
        followersCount={0}
        followingCount={0}
      />
    </View>
  );
}
