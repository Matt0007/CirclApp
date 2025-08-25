import React from "react";
import { ScrollView } from "react-native";
import { Text, View, XStack, YStack, Button } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { colors } = useTheme();
  const { user, isAuthenticated } = useAuth();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header avec boutons d'action */}
        <XStack
          justifyContent="flex-end"
          alignItems="center"
          paddingHorizontal="$4"
          paddingVertical="$3"
        >
          <XStack space="$2">
            <Button
              size="$3"
              circular
              borderRadius="$4"
              backgroundColor={colors.card}
              onPress={() => console.log("Share")}
            >
              <Ionicons
                name="share-outline"
                size={20}
                color={colors.foreground}
              />
            </Button>
            <Button
              size="$3"
              circular
              borderRadius="$4"
              backgroundColor={colors.card}
              onPress={() => console.log("Edit")}
            >
              <Ionicons
                name="pencil-sharp"
                size={20}
                color={colors.foreground}
              />
            </Button>
            <Button
              size="$3"
              circular
              borderRadius="$4"
              backgroundColor={colors.card}
              onPress={() => router.push("/(backPage)/settings")}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={colors.foreground}
              />
            </Button>
          </XStack>
        </XStack>

        {/* Section principale du profil */}
        <YStack paddingHorizontal="$4" space="$4">
          {/* Informations du profil */}
          <XStack space="$4" alignItems="center">
            {/* Avatar avec image réelle */}
            <View
              width={80}
              height={80}
              borderRadius={40}
              overflow="hidden"
              backgroundColor={colors.accent}
            >
              {user.profileImage ? (
                <View
                  width="100%"
                  height="100%"
                  backgroundColor={colors.accent}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons
                    name="person"
                    size={40}
                    color={colors.mutedForeground}
                  />
                </View>
              ) : (
                <View
                  width="100%"
                  height="100%"
                  backgroundColor={colors.accent}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons
                    name="person"
                    size={40}
                    color={colors.mutedForeground}
                  />
                </View>
              )}
            </View>

            {/* Détails utilisateur avec vraies données */}
            <YStack flex={1} space="$2" >
              <XStack>
                <Text color={colors.foreground} fontSize="$5" fontWeight="bold">
                  {user.firstName} {user.lastName}
                </Text>
              </XStack>

              {/* Trois statistiques - pour l'instant avec des valeurs par défaut */}
              <XStack space="$4" marginTop="$2">
                <YStack  flex={1}>
                  <Text
                    color={colors.foreground}
                    fontSize="$4"
                    fontWeight="bold"
                  >
                    0
                  </Text>
                  <Text color={colors.mutedForeground} fontSize="$2">
                    Posts
                  </Text>
                </YStack>
                <YStack  flex={1}>
                  <Text
                    color={colors.foreground}
                    fontSize="$4"
                    fontWeight="bold"
                  >
                    0
                  </Text>
                  <Text color={colors.mutedForeground} fontSize="$2">
                    Followers
                  </Text>
                </YStack>
                <YStack  flex={1}>
                  <Text
                    
                    color={colors.foreground}
                    fontSize="$4"
                    fontWeight="bold"
                  >
                    0
                  </Text>
                  <Text color={colors.mutedForeground} fontSize="$2">
                    Following
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </XStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
