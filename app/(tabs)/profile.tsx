import React from "react";
import { ScrollView } from "react-native";
import { Text, View, XStack, YStack, Button } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useUserSports } from "../../hooks/useUserSports";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonGradient } from "@/components/common";

export default function Profile() {
  const { colors } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { sports, loading: sportsLoading } = useUserSports();

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
        {/* Header avec nom et boutons d'action */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="$4"
          paddingVertical="$4"
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
              focusStyle={{ backgroundColor: 'transparent' }}
              hoverStyle={{ backgroundColor: 'transparent' }}
              pressStyle={{ backgroundColor: 'transparent' }}

              borderWidth={0}
              outlineColor="transparent"
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
              focusStyle={{ backgroundColor: 'transparent' }}
              hoverStyle={{ backgroundColor: 'transparent' }}
              pressStyle={{ backgroundColor: 'transparent' }}
              borderWidth={0}
              outlineColor="transparent"
              onPress={() => router.push("/(backPage)/settings")}
            >
              <Ionicons name="menu" size={24} color={colors.foreground} />
            </Button>
          </XStack>
        </XStack>

        {/* Section principale du profil */}
        <YStack paddingHorizontal="$4" paddingTop="$5" space="$5">
          {/* Informations du profil */}
          <XStack space="$5" alignItems="flex-start">
            {/* Avatar */}
            <View
              width={90}
              height={90}
              borderRadius={45}
              overflow="hidden"
              backgroundColor={colors.accent}
              borderWidth={3}
              borderColor={colors.primary}
              shadowColor={colors.foreground}
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={4}
            >
              <View
                width="100%"
                height="100%"
                backgroundColor={colors.accent}
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons
                  name="person"
                  size={45}
                  color={colors.mutedForeground}
                />
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
                {sportsLoading ? (
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
                      Chargement...
                    </Text>
                  </View>
                ) : sports.length > 0 ? (
                  sports.map((sport) => (
                    <View
                      key={sport.id}
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
                        {sport.name}
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
    </SafeAreaView>
  );
}
