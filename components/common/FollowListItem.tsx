import React, { useState, useEffect } from "react";
import { Pressable } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import { useSecureImage } from "../../hooks/useSecureImage";
import { useFollow } from "../../hooks/useFollow";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "../../types";
import ButtonGradient from "./ButtonGradient";

interface FollowListItemProps {
  user: User;
  isOwnProfile: boolean;
  tabType: "followers" | "following";
  currentUserId?: string; // ID de l'utilisateur connecté
  onUserPress: () => void;
  onFollowChange?: () => void;
}

export const FollowListItem: React.FC<FollowListItemProps> = ({
  user,
  isOwnProfile,
  tabType,
  currentUserId,
  onUserPress,
  onFollowChange,
}) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { secureImageUrl } = useSecureImage(user.profileImage || null);
  const {
    followUser,
    unfollowUser,
    checkFollowStatus,
    removeFollower,
    isLoading,
  } = useFollow();

  const [isFollowing, setIsFollowing] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Vérifier le statut de suivi au chargement
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await checkFollowStatus(user.id);
        if (response?.success) {
          setIsFollowing(response.data.isFollowing);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification du statut de suivi:",
          error
        );
      } finally {
        setIsCheckingStatus(false);
        setHasInitialized(true);
      }
    };

    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const handleFollowToggle = async () => {
    console.log(
      "🎯 Bouton cliqué! isOwnProfile:",
      isOwnProfile,
      "isFollowing:",
      isFollowing
    );

    if (isLoading) {
      console.log("⏳ Déjà en cours de chargement");
      return;
    }

    try {
      let response;

      if (isOwnProfile) {
        // Sur son propre profil
        if (tabType === "followers") {
          // Dans ses propres followers, on supprime le follower
          if (currentUserId) {
            console.log("🗑️ Suppression du follower:", user.id);
            response = await removeFollower(currentUserId, user.id);
          } else {
            console.error("ID de l'utilisateur connecté manquant");
            return;
          }
        } else if (tabType === "following") {
          // Dans ses propres following, on unfollow normalement
          console.log("🔄 Unfollowing depuis mon profil:", user.id);
          response = await unfollowUser(user.id);
        }
      } else {
        // Sur le profil de quelqu'un d'autre - logique Follow/Unfollow normale
        if (isFollowing) {
          console.log("🔄 Unfollowing user:", user.id);
          response = await unfollowUser(user.id);
        } else {
          console.log("🔄 Following user:", user.id);
          response = await followUser(user.id);
        }
      }

      console.log("📝 Response:", response);

      if (response?.success) {
        console.log("✅ Action réussie, changement d'état");
        setIsFollowing(!isFollowing); // Inverser l'état pour les autres profils
        // Notifier le parent du changement
        onFollowChange?.();
      } else {
        console.error("❌ Erreur:", response?.message || "Réponse invalide");
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut de suivi:", error);
    }
  };

  // Déterminer le texte et l'action du bouton selon le contexte
  const getButtonConfig = () => {
    if (isOwnProfile) {
      // Sur son propre profil
      if (tabType === "following") {
        return {
          title: t("unfollow"),
          variant: "secondary" as const,
          action: handleFollowToggle,
        };
      } else if (tabType === "followers") {
        // Dans ses propres followers, on veut supprimer le follower
        return {
          title: t("remove"),
          variant: "secondary" as const,
          action: handleFollowToggle,
        };
      }
    } else {
      // Sur le profil de quelqu'un d'autre
      if (tabType === "following") {
        return {
          title: isFollowing ? t("unfollow") : t("follow"),
          variant: isFollowing ? ("secondary" as const) : ("primary" as const),
          action: handleFollowToggle,
        };
      } else if (tabType === "followers") {
        return {
          title: isFollowing ? t("unfollow") : t("follow"),
          variant: isFollowing ? ("secondary" as const) : ("primary" as const),
          action: handleFollowToggle,
        };
      }
    }
    return null;
  };

  const buttonConfig = getButtonConfig();

  return (
    <Pressable onPress={onUserPress}>
      <XStack
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$3"
        backgroundColor={colors.background}
      >
        {/* Avatar */}
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            marginRight: 12,
          }}
        >
          {/* Dégradé de la bordure */}
          <LinearGradient
            colors={[colors.primary, colors.primary + "80", colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: "absolute",
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />

          {/* Cercle intérieur */}
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              backgroundColor: colors.card,
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {secureImageUrl ? (
              <Image
                source={{ uri: secureImageUrl }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                }}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={100}
              />
            ) : (
              <Ionicons name="person" size={20} color={colors.primary} />
            )}
          </View>
        </View>

        {/* Informations utilisateur */}
        <YStack flex={1} space="$1">
          <Text
            color={colors.foreground}
            fontSize="$4"
            fontWeight="600"
            numberOfLines={1}
          >
            {user.firstName} {user.lastName}
          </Text>
          <Text color={colors.mutedForeground} fontSize="$3" numberOfLines={1}>
            @{user.userName}
          </Text>
        </YStack>

        {/* Bouton d'action */}
        {buttonConfig && hasInitialized && (
          <View style={{ width: 100 }}>
            <ButtonGradient
              title={buttonConfig.title}
              size="xs"
              onPress={handleFollowToggle}
              variant={buttonConfig.variant}
              disabled={isLoading || isCheckingStatus}
            />
          </View>
        )}
        {/* Skeleton du bouton pendant l'initialisation */}
        {buttonConfig && !hasInitialized && (
          <View
            style={{
              width: 80,
              height: 32,
              backgroundColor: colors.mutedForeground + "20",
              borderRadius: 16,
            }}
          />
        )}
      </XStack>
    </Pressable>
  );
};
