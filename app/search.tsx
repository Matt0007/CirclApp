import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Text, XStack, Button } from "tamagui";
import { useTheme } from "../contexts/ThemeContext";
import { useSecureImage } from "../hooks/useSecureImage";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { API_BASE_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { SearchSkeleton } from "../components/common";

interface SearchUser {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  profileImage?: string;
  userSports?: {
    sport: {
      name: string;
    };
  }[];
}

// Composant pour un utilisateur dans la liste de recherche
const SearchUserItem = ({
  user,
  colors,
  onPress,
}: {
  user: SearchUser;
  colors: any;
  onPress: (userId: string, secureImageUrl?: string) => void;
}) => {
  const { secureImageUrl } = useSecureImage(user.profileImage || null);
  const [imageLoading, setImageLoading] = useState(!!secureImageUrl);

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      onPress={() => onPress(user.id, secureImageUrl || undefined)}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          marginRight: 12,
          backgroundColor: colors.muted,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {secureImageUrl ? (
          <>
            {imageLoading && (
              <View
                style={{
                  position: "absolute",
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: colors.muted,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="person" size={24} color={colors.primary} />
              </View>
            )}
            <Image
              source={{ uri: secureImageUrl }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
              }}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              placeholder={null}
              transition={200}
            />
          </>
        ) : (
          <Ionicons name="person" size={24} color={colors.primary} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          color={colors.foreground}
          fontSize="$5"
          fontWeight="600"
          numberOfLines={1}
        >
          {user.firstName} {user.lastName}
        </Text>
        {user.userSports && user.userSports.length > 0 && (
          <XStack space="$1" alignItems="center" marginTop="$1">
            <Text
              color={colors.mutedForeground}
              fontSize="$2"
              numberOfLines={1}
            >
              {user.userSports
                .slice(0, 3)
                .map((s) => s.sport.name)
                .join(" • ")}
              {user.userSports.length > 3 &&
                " +" + (user.userSports.length - 3)}
            </Text>
          </XStack>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.foreground} />
    </TouchableOpacity>
  );
};

export default function Search() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim() || query.trim().length < 1) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token non trouvé");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Erreur lors de la recherche:",
          errorData.error || response.status
        );
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Erreur de recherche:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleUserPress = (userId: string, secureImageUrl?: string) => {
    Keyboard.dismiss();
    router.push({
      pathname: `/profile/${userId}`,
      params: { secureImageUrl },
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      {/* Barre de recherche avec bouton Annuler */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.background,
        }}
      >
        <XStack space="$3" alignItems="center">
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

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.card,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Ionicons name="search" size={20} color={colors.mutedForeground} />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 8,
                fontSize: 16,
                color: colors.foreground,
              }}
              placeholder="Rechercher des utilisateurs..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.mutedForeground}
                />
              </TouchableOpacity>
            )}
          </View>
        </XStack>
      </View>

      {/* Résultats */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {isLoading ? (
          <SearchSkeleton count={5} />
        ) : hasSearched && searchResults.length === 0 ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text color={colors.mutedForeground}>Aucun utilisateur trouvé</Text>
          </View>
        ) : (
          searchResults.map((user) => (
            <SearchUserItem
              key={user.id}
              user={user}
              colors={colors}
              onPress={handleUserPress}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
