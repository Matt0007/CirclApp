import React from "react";
import { ScrollView } from "react-native";
import { Text, View, XStack, YStack, Button } from "tamagui";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ButtonGradient } from "@/components/common";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const { colors } = useTheme();
  const { user, isAuthenticated, secureImageUrl, refreshUserData } = useAuth();
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

      {/* Contenu scrollable */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section principale du profil */}
        <YStack paddingHorizontal="$4" paddingTop="$5" space="$5">
          {/* Informations du profil */}
          <XStack space="$5" alignItems="flex-start">
            {/* Avatar */}
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Dégradé de la bordure */}
              <LinearGradient
                colors={[colors.primary, colors.primary + "80", colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: "absolute",
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                }}
              />

              {/* Cercle intérieur */}
              <View
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 42,
                  backgroundColor: colors.card,
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {secureImageUrl && secureImageUrl !== null ? (
                  <Image
                    source={{ uri: secureImageUrl }}
                    style={{
                      width: 84,
                      height: 84,
                      borderRadius: 42,
                    }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={100}
                  />
                ) : (
                  <Ionicons name="person" size={40} color={colors.primary} />
                )}
              </View>
            </View>

            {/* Statistiques et description */}
            <YStack flex={1} space="$4">
              {/* Trois statistiques */}
              <XStack space="$1" justifyContent="space-between" marginLeft="$8">
                <YStack flex={1} alignItems="flex-start" space="$1">
                  <Text
                    color={colors.mutedForeground}
                    fontSize="$2"
                    fontWeight="500"
                  >
                    Post
                  </Text>
                  <Text
                    color={colors.foreground}
                    fontSize="$5"
                    fontWeight="700"
                  >
                    0
                  </Text>
                </YStack>
                <YStack flex={1} alignItems="flex-start" space="$1">
                  <Text
                    color={colors.mutedForeground}
                    fontSize="$2"
                    fontWeight="500"
                  >
                    Follower
                  </Text>
                  <Text
                    color={colors.foreground}
                    fontSize="$5"
                    fontWeight="700"
                  >
                    0
                  </Text>
                </YStack>
                <YStack flex={1} alignItems="flex-start" space="$1">
                  <Text
                    color={colors.mutedForeground}
                    fontSize="$2"
                    fontWeight="500"
                  >
                    Following
                  </Text>
                  <Text
                    color={colors.foreground}
                    fontSize="$5"
                    fontWeight="700"
                  >
                    0
                  </Text>
                </YStack>
              </XStack>
              <Text
                color={colors.foreground}
                fontSize="$3"
                lineHeight={20}
                numberOfLines={2}
              >
                Aucune description
              </Text>
            </YStack>
          </XStack>

          {/* Bouton Modifier le profil */}
          <YStack space="$3">
            <ButtonGradient
              title="Modifier le profil"
              onPress={() => console.log("Modifier le profil")}
              size="small"
            />
          </YStack>

          {/* Liste horizontale des sports */}
          <YStack space="$3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              <XStack space="$3">
                {user.userSports && user.userSports.length > 0 ? (
                  user.userSports.map((userSport) => (
                    <View
                      key={userSport.id}
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      backgroundColor={colors.accent}
                      borderRadius="$3"
                    >
                      <Text
                        color={colors.accentForeground}
                        fontSize="$2"
                        fontWeight="500"
                      >
                        {userSport.sport.name}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    backgroundColor={colors.muted}
                    borderRadius="$3"
                  >
                    <Text
                      color={colors.mutedForeground}
                      fontSize="$2"
                      fontWeight="500"
                    >
                      Aucun sport
                    </Text>
                  </View>
                )}
              </XStack>
            </ScrollView>
          </YStack>
        </YStack>
      </ScrollView>
    </View>
  );
}
