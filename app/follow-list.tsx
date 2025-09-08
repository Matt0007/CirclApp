import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Pressable, ActivityIndicator } from "react-native";
import { Text, View, XStack } from "tamagui";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useFollow } from "../hooks/useFollow";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { FollowListItem } from "../components/common";
import { FollowListSkeleton } from "../components/skeleton";

type TabType = "followers" | "following";

export default function FollowList() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { userId, initialTab } = useLocalSearchParams<{
    userId: string;
    initialTab?: TabType;
  }>();

  const { getFollowers, getFollowing } = useFollow();
  const [activeTab, setActiveTab] = useState<TabType>(
    (initialTab as TabType) || "followers"
  );
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // États de pagination
  const [followersPage, setFollowersPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);
  const [followersHasMore, setFollowersHasMore] = useState(true);
  const [followingHasMore, setFollowingHasMore] = useState(true);
  const [followersTotal, setFollowersTotal] = useState(0);
  const [followingTotal, setFollowingTotal] = useState(0);

  const loadData = useCallback(
    async (reset = true) => {
      if (!userId) return;

      if (reset) {
        setIsLoading(true);
        setFollowersPage(1);
        setFollowingPage(1);
        setFollowersHasMore(true);
        setFollowingHasMore(true);
      }

      try {
        // Charger les followers
        const followersResponse = await getFollowers(userId, 1, 50);
        if (followersResponse?.success) {
          setFollowers(followersResponse.data.followers);
          setFollowersTotal(followersResponse.data.pagination.total);
          setFollowersHasMore(followersResponse.data.pagination.total > 50);
        }

        // Charger les following
        const followingResponse = await getFollowing(userId, 1, 50);
        if (followingResponse?.success) {
          setFollowing(followingResponse.data.following);
          setFollowingTotal(followingResponse.data.pagination.total);
          setFollowingHasMore(followingResponse.data.pagination.total > 50);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        if (reset) {
          setIsLoading(false);
        }
      }
    },
    [userId]
  );

  const loadMoreData = useCallback(async () => {
    if (!userId || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      if (activeTab === "followers" && followersHasMore) {
        const nextPage = followersPage + 1;
        const followersResponse = await getFollowers(userId, nextPage, 50);
        if (followersResponse?.success) {
          setFollowers((prev) => [
            ...prev,
            ...followersResponse.data.followers,
          ]);
          setFollowersPage(nextPage);
          setFollowersHasMore(followersResponse.data.followers.length === 50);
        }
      } else if (activeTab === "following" && followingHasMore) {
        const nextPage = followingPage + 1;
        const followingResponse = await getFollowing(userId, nextPage, 50);
        if (followingResponse?.success) {
          setFollowing((prev) => [
            ...prev,
            ...followingResponse.data.following,
          ]);
          setFollowingPage(nextPage);
          setFollowingHasMore(followingResponse.data.following.length === 50);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement de plus de données:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    userId,
    activeTab,
    followersPage,
    followingPage,
    followersHasMore,
    followingHasMore,
    isLoadingMore,
  ]);

  useEffect(() => {
    if (userId && user) {
      setIsOwnProfile(userId === user.id);
      loadData();
    }
  }, [userId, user, loadData]);

  // Recharger les données quand on revient sur la page
  useFocusEffect(
    useCallback(() => {
      if (userId && user) {
        console.log("🔄 Rechargement des données follow-list...");
        loadData(false); // false pour ne pas remettre isLoading à true
      }
    }, [userId, user, loadData])
  );

  const currentData = activeTab === "followers" ? followers : following;
  const currentHasMore =
    activeTab === "followers" ? followersHasMore : followingHasMore;
  const followersCount = followersTotal;
  const followingCount = followingTotal;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$3"
        backgroundColor={colors.background}
      >
        <XStack space="$3" flex={1} alignItems="center">
          <Ionicons
            name="chevron-back-outline"
            size={24}
            color={colors.foreground}
            onPress={() => router.back()}
          />
          <Text color={colors.foreground} fontSize="$6" fontWeight="700">
            {user?.firstName} {user?.lastName}
          </Text>
        </XStack>
      </XStack>

      {/* Tabs avec design moderne */}
      <View paddingHorizontal="$4" paddingVertical="$3">
        <XStack borderRadius="$3" padding="$1">
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setActiveTab("followers")}
          >
            <View
              borderBottomWidth={1}
              borderBottomColor={
                activeTab === "followers" ? colors.foreground : "transparent"
              }
              borderRadius="$2"
              paddingVertical="$2"
              paddingHorizontal="$4"
              alignItems="center"
            >
              <Text
                color={
                  activeTab === "followers"
                    ? colors.foreground
                    : colors.mutedForeground
                }
                fontSize="$4"
                fontWeight={activeTab === "followers" ? "700" : "500"}
              >
                {followersCount} Follower{followersCount > 1 ? "s" : ""}
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setActiveTab("following")}
          >
            <View
              borderBottomWidth={1}
              borderBottomColor={
                activeTab === "following" ? colors.foreground : "transparent"
              }
              borderRadius="$2"
              paddingVertical="$2"
              paddingHorizontal="$4"
              alignItems="center"
            >
              <Text
                color={
                  activeTab === "following"
                    ? colors.foreground
                    : colors.mutedForeground
                }
                fontSize="$4"
                fontWeight={activeTab === "following" ? "700" : "500"}
              >
                {followingCount} Following
              </Text>
            </View>
          </Pressable>
        </XStack>
      </View>

      {/* Liste */}
      <View flex={1}>
        {isLoading ? (
          <FollowListSkeleton />
        ) : currentData.length === 0 ? (
          <View
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding="$4"
          >
            <Ionicons
              name={
                activeTab === "followers"
                  ? "people-outline"
                  : "person-add-outline"
              }
              size={64}
              color={colors.mutedForeground}
            />
            <Text
              color={colors.mutedForeground}
              fontSize="$4"
              textAlign="center"
              marginTop="$4"
            >
              {activeTab === "followers"
                ? "Aucun follower pour le moment"
                : "Aucune personne suivie pour le moment"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={currentData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FollowListItem
                user={item}
                isOwnProfile={isOwnProfile}
                tabType={activeTab}
                currentUserId={user?.id}
                onUserPress={() => {
                  // Navigation vers le profil de l'utilisateur
                  router.push(`/profile/${item.id}`);
                }}
                onFollowChange={() => {
                  // Recharger les données après un changement de suivi
                  loadData(false);
                }}
              />
            )}
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() => {
              if (isLoadingMore && currentHasMore) {
                return (
                  <View paddingVertical="$4" alignItems="center">
                    <ActivityIndicator color={colors.primary} size="small" />
                    <Text
                      color={colors.mutedForeground}
                      fontSize="$3"
                      marginTop="$2"
                    >
                      Chargement...
                    </Text>
                  </View>
                );
              }
              return null;
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
