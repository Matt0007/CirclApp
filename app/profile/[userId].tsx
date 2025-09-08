import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, XStack, Button } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { UserProfile, ProfileSkeleton } from "../../components/common";
import { API_BASE_URL } from "../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../../types";

export default function PublicProfile() {
  const { colors } = useTheme();
  const { user: currentUser } = useAuth();
  const insets = useSafeAreaInsets();
  const { userId, secureImageUrl } = useLocalSearchParams<{
    userId: string;
    secureImageUrl?: string;
  }>();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUserProfile = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Token d'authentification requis");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileUser(data.user);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "Erreur lors du chargement du profil");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      setError("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier si c'est le profil de l'utilisateur connecté
  const isOwnProfile = currentUser?.id === userId;

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: insets.top,
        }}
      >
        {/* Header skeleton */}
        <XStack
          alignItems="center"
          paddingHorizontal="$4"
          paddingVertical="$3"
          backgroundColor={colors.background}
        >
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: colors.foreground + "20",
              borderRadius: 20,
            }}
          />
          <View
            style={{
              flex: 1,
              height: 20,
              backgroundColor: colors.foreground + "20",
              borderRadius: 10,
              marginHorizontal: 16,
            }}
          />
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: "transparent",
            }}
          />
        </XStack>

        {/* Contenu skeleton */}
        <ProfileSkeleton />
      </View>
    );
  }

  if (error || !profileUser) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: insets.top,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text color={colors.foreground} fontSize="$5" marginBottom="$4">
          {error || "Profil non trouvé"}
        </Text>
        <Button
          backgroundColor={colors.primary}
          color={colors.primaryForeground}
          onPress={() => router.back()}
        >
          Retour
        </Button>
      </View>
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
      {/* Header avec nom et bouton retour */}
      <XStack
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$3"
        backgroundColor={colors.background}
      >
        <Button
          size="$3"
          circular
          backgroundColor="transparent"
          onPress={() => router.back()}
          outlineColor="transparent"
          focusStyle={{ backgroundColor: "transparent" }}
          hoverStyle={{ backgroundColor: "transparent" }}
          pressStyle={{ backgroundColor: "transparent" }}
          borderWidth={0}
        >
          <Ionicons
            name="chevron-back-outline"
            size={24}
            color={colors.foreground}
          />
        </Button>

        <Text color={colors.foreground} fontSize="$6" fontWeight="700">
          {profileUser.firstName} {profileUser.lastName}
        </Text>

        <View style={{ width: 40 }} />
      </XStack>

      {/* Contenu du profil utilisant le composant réutilisable */}
      <UserProfile
        user={profileUser}
        isOwnProfile={isOwnProfile}
        postsCount={0}
        followersCount={0}
        followingCount={0}
        secureImageUrl={secureImageUrl}
      />
    </View>
  );
}
