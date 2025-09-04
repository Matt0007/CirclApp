import React from "react";
import { View, ScrollView } from "react-native";
import { Text, XStack, Button } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Index() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      {/* Header avec nom et boutons d'action */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$2"
        backgroundColor={colors.background}
      >
        {/* Nom complet */}
        <View style={{ flex: 1 }}>
          <Text
            color={colors.foreground}
            fontSize="$7"
            fontWeight="800"
            numberOfLines={1}
          >
            {user?.firstName} {user?.lastName}
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
            onPress={() => router.push("/search")}
          >
            <Ionicons name="search" size={24} color={colors.foreground} />
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
          >
            <Ionicons name="chatbubble" size={24} color={colors.foreground} />
          </Button>
        </XStack>
      </XStack>

      {/* Contenu principal scrollable */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text fontSize={24} fontWeight="bold" color={colors.foreground}>
          Actualités
        </Text>
        <Button
          onPress={() => router.push("/(formProfile)/complete-profil-combined")}
        >
          Complete profile
        </Button>
      </ScrollView>
    </View>
  );
}
