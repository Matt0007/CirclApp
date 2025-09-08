import React, { useState, useEffect } from "react";
import { ScrollView, Pressable } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import { useSecureImage } from "../../hooks/useSecureImage";
import { useFollow } from "../../hooks/useFollow";
import { ProfileSkeleton } from "../skeleton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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
  refreshTrigger?: number; // Pour forcer le rechargement des stats
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isOwnProfile,
  postsCount = 0,
  followersCount = 0,
  followingCount = 0,
  secureImageUrl: providedImageUrl,
  refreshTrigger,
}) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { secureImageUrl: profileImageUrl } = useSecureImage(
    user.profileImage || null
  );
  const {
    followUser,
    unfollowUser,
    checkFollowStatus,
    getFollowers,
    getFollowing,
    isLoading,
  } = useFollow();

  const [isFollowing, setIsFollowing] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [apiFollowersCount, setApiFollowersCount] = useState(0);
  const [apiFollowingCount, setApiFollowingCount] = useState(0);
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Utiliser l'image fournie en prop ou celle générée par le hook
  const finalImageUrl = providedImageUrl || profileImageUrl;

  // Vérifier le statut de suivi et récupérer les compteurs au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ne pas afficher le skeleton lors des rechargements (refreshTrigger)
        if (isInitialLoad) {
          setIsLoadingCounts(true);
        }

        // Récupérer les compteurs pour tous les profils
        const followersResponse = await getFollowers(user.id, 1, 1);
        if (followersResponse?.success) {
          setApiFollowersCount(followersResponse.data.pagination.total);
        }

        const followingResponse = await getFollowing(user.id, 1, 1);
        if (followingResponse?.success) {
          setApiFollowingCount(followingResponse.data.pagination.total);
        }

        // Vérifier le statut de suivi seulement si ce n'est pas notre propre profil
        if (!isOwnProfile) {
          const followStatusResponse = await checkFollowStatus(user.id);
          if (followStatusResponse?.success) {
            setIsFollowing(followStatusResponse.data.isFollowing);
          }
          setIsCheckingStatus(false);
        } else {
          setIsCheckingStatus(false);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        if (isInitialLoad) {
          setIsLoadingCounts(false);
          setIsInitialLoad(false);
        }
      }
    };

    fetchData();
  }, [
    user.id,
    isOwnProfile,
    refreshTrigger,
    checkFollowStatus,
    getFollowers,
    getFollowing,
    isInitialLoad,
  ]);

  const handleFollowToggle = async () => {
    if (isLoading || isOwnProfile) return;

    try {
      let response;
      if (isFollowing) {
        response = await unfollowUser(user.id);
      } else {
        response = await followUser(user.id);
      }

      if (response.success) {
        setIsFollowing(!isFollowing);
        // Mettre à jour les compteurs après le changement
        try {
          const followersResponse = await getFollowers(user.id, 1, 1);
          if (followersResponse?.success) {
            setApiFollowersCount(followersResponse.data.pagination.total);
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour des compteurs:", error);
        }
      } else {
        console.error("Erreur:", response.message);
        // Ici vous pourriez afficher une alerte ou un toast
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut de suivi:", error);
    }
  };

  // Afficher le skeleton global pendant le chargement des compteurs
  if (isLoadingCounts) {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileSkeleton />
      </ScrollView>
    );
  }

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
                  {t("post")}
                </Text>
                <Text color={colors.foreground} fontSize="$5" fontWeight="700">
                  {postsCount}
                </Text>
              </YStack>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/follow-list",
                    params: { userId: user.id, initialTab: "followers" },
                  });
                }}
                style={{ flex: 1 }}
              >
                <YStack flex={1} alignItems="flex-start" space="$1">
                  <Text
                    color={colors.mutedForeground}
                    fontSize="$2"
                    fontWeight="500"
                  >
                    {t("follower")}
                  </Text>
                  <Text
                    color={colors.foreground}
                    fontSize="$5"
                    fontWeight="700"
                  >
                    {apiFollowersCount}
                  </Text>
                </YStack>
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/follow-list",
                    params: { userId: user.id, initialTab: "following" },
                  });
                }}
                style={{ flex: 1 }}
              >
                <YStack flex={1} alignItems="flex-start" space="$1">
                  <Text
                    color={colors.mutedForeground}
                    fontSize="$2"
                    fontWeight="500"
                  >
                    {t("following")}
                  </Text>
                  <Text
                    color={colors.foreground}
                    fontSize="$5"
                    fontWeight="700"
                  >
                    {apiFollowingCount}
                  </Text>
                </YStack>
              </Pressable>
            </XStack>
            <Text
              color={colors.foreground}
              fontSize="$3"
              lineHeight={20}
              numberOfLines={2}
            >
              {t("noDescription")}
            </Text>
          </YStack>
        </XStack>

        {/* Boutons d'action */}
        {isOwnProfile ? (
          <ButtonGradient
            size="xs"
            title={t("editProfile")}
            onPress={() => console.log("Modifier le profil")}
          />
        ) : (
          <XStack space="$3">
            <View style={{ flex: 1 }}>
              <ButtonGradient
                title={
                  isCheckingStatus
                    ? "..."
                    : isFollowing
                    ? t("unfollow")
                    : t("follow")
                }
                size="xs"
                onPress={handleFollowToggle}
                disabled={isLoading || isCheckingStatus}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ButtonGradient
                title={t("write")}
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
                    {t("noSport")}
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
