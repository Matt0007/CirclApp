import React from "react";
import { ScrollView } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useSecureImage } from "../../hooks/useSecureImage";
import { Ionicons } from "@expo/vector-icons";

import ButtonGradient from "./ButtonGradient";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "../../types";

interface UserProfileProps {
  user: User;
  isOwnProfile: boolean;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  secureImageUrl?: string | null;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isOwnProfile,
  postsCount = 0,
  followersCount = 0,
  followingCount = 0,
  secureImageUrl: providedImageUrl,
}) => {
  const { colors } = useTheme();
  const { secureImageUrl: profileImageUrl } = useSecureImage(
    user.profileImage || null
  );

  // Utiliser l'image fournie en prop ou celle générée par le hook
  const finalImageUrl = providedImageUrl || profileImageUrl;

  return (
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
              {finalImageUrl && finalImageUrl !== null ? (
                <Image
                  source={{ uri: finalImageUrl }}
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
                <Text color={colors.foreground} fontSize="$5" fontWeight="700">
                  {postsCount}
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
                <Text color={colors.foreground} fontSize="$5" fontWeight="700">
                  {followersCount}
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
                <Text color={colors.foreground} fontSize="$5" fontWeight="700">
                  {followingCount}
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

        {/* Boutons d'action */}
        {isOwnProfile ? (
          <ButtonGradient
            size="xs"
            title="Modifier le profil"
            onPress={() => console.log("Modifier le profil")}
          />
        ) : (
          <XStack space="$3">
            <View style={{ flex: 1 }}>
              <ButtonGradient
                title="Suivre"
                size="xs"
                onPress={() => console.log("Suivre l'utilisateur")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ButtonGradient
                title="Écrire"
                size="xs"
                onPress={() => console.log("Écrire à l'utilisateur")}
                variant="secondary"
              />
            </View>
          </XStack>
        )}

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
  );
};
