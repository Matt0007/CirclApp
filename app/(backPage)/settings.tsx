import React from "react";
import { ScrollView, Alert } from "react-native";
import { Text, View, XStack, YStack, H2, Switch, ListItem } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { BackHeader } from "../../components/common/BackHeader";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { colors, colorScheme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <BackHeader title="Paramètres" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack padding="$4" space="$6">
          {/* Section Apparence */}
          <YStack space="$3">
            <H2 color={colors.foreground} fontSize="$4" fontWeight="600">
              Apparence
            </H2>

            <View
              backgroundColor={colors.card}
              borderRadius="$3"
              borderColor={colors.border}
              borderWidth={1}
              overflow="hidden"
            >
              <ListItem
                backgroundColor="transparent"
                borderBottomWidth={1}
                borderBottomColor={colors.border}
                paddingVertical="$4"
                paddingHorizontal="$4"
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <YStack>
                    <Text
                      color={colors.foreground}
                      fontSize="$4"
                      fontWeight="500"
                    >
                      Mode sombre
                    </Text>
                    <Text
                      color={colors.mutedForeground}
                      fontSize="$2"
                      marginTop="$1"
                    >
                      {colorScheme === "dark"
                        ? "Thème sombre activé"
                        : "Thème clair activé"}
                    </Text>
                  </YStack>
                  <Switch
                    checked={colorScheme === "dark"}
                    onCheckedChange={toggleTheme}
                    backgroundColor={colors.accent}
                    borderColor={colors.border}
                  >
                    <Switch.Thumb
                      backgroundColor={
                        colorScheme === "dark"
                          ? colors.primary
                          : colors.foreground
                      }
                    />
                  </Switch>
                </XStack>
              </ListItem>
            </View>
          </YStack>

          {/* Section Compte */}
          <YStack space="$3">
            <H2 color={colors.foreground} fontSize="$4" fontWeight="600">
              Compte
            </H2>

            <View
              backgroundColor={colors.card}
              borderRadius="$3"
              borderColor={colors.border}
              borderWidth={1}
              overflow="hidden"
            >
              <ListItem
                backgroundColor="transparent"
                borderBottomWidth={1}
                borderBottomColor={colors.border}
                paddingVertical="$4"
                paddingHorizontal="$4"
                onPress={() => router.push("/(backPage)/edit-profile")}
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$3" alignItems="center">
                    <View
                      backgroundColor={colors.primary}
                      borderRadius="$2"
                      padding="$2"
                    >
                      <Ionicons
                        name="person"
                        size={20}
                        color={colors.primaryForeground}
                      />
                    </View>
                    <YStack>
                      <Text
                        color={colors.foreground}
                        fontSize="$4"
                        fontWeight="500"
                      >
                        Modifier le profil
                      </Text>
                      <Text
                        color={colors.mutedForeground}
                        fontSize="$2"
                        marginTop="$1"
                      >
                        Changer vos informations personnelles
                      </Text>
                    </YStack>
                  </XStack>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </XStack>
              </ListItem>

              <ListItem
                backgroundColor="transparent"
                paddingVertical="$4"
                paddingHorizontal="$4"
                onPress={handleLogout}
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$3" alignItems="center">
                    <View
                      backgroundColor={colors.destructive}
                      borderRadius="$2"
                      padding="$2"
                    >
                      <Ionicons
                        name="log-out"
                        size={20}
                        color={colors.destructiveForeground}
                      />
                    </View>
                    <YStack>
                      <Text
                        color={colors.foreground}
                        fontSize="$4"
                        fontWeight="500"
                      >
                        Se déconnecter
                      </Text>
                      <Text
                        color={colors.mutedForeground}
                        fontSize="$2"
                        marginTop="$1"
                      >
                        Fermer votre session
                      </Text>
                    </YStack>
                  </XStack>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </XStack>
              </ListItem>
            </View>
          </YStack>

          {/* Section Support */}
          <YStack space="$3">
            <H2 color={colors.foreground} fontSize="$4" fontWeight="600">
              Support
            </H2>

            <View
              backgroundColor={colors.card}
              borderRadius="$3"
              borderColor={colors.border}
              borderWidth={1}
              overflow="hidden"
            >
              <ListItem
                backgroundColor="transparent"
                borderBottomWidth={1}
                borderBottomColor={colors.border}
                paddingVertical="$4"
                paddingHorizontal="$4"
                onPress={() => console.log("Help")}
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$3" alignItems="center">
                    <View
                      backgroundColor={colors.accent}
                      borderRadius="$2"
                      padding="$2"
                    >
                      <Ionicons
                        name="help-circle"
                        size={20}
                        color={colors.foreground}
                      />
                    </View>
                    <YStack>
                      <Text
                        color={colors.foreground}
                        fontSize="$4"
                        fontWeight="500"
                      >
                        Aide
                      </Text>
                      <Text
                        color={colors.mutedForeground}
                        fontSize="$2"
                        marginTop="$1"
                      >
                        Centre d&apos; aide et FAQ
                      </Text>
                    </YStack>
                  </XStack>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </XStack>
              </ListItem>

              <ListItem
                backgroundColor="transparent"
                paddingVertical="$4"
                paddingHorizontal="$4"
                onPress={() => console.log("Contact")}
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$3" alignItems="center">
                    <View
                      backgroundColor={colors.accent}
                      borderRadius="$2"
                      padding="$2"
                    >
                      <Ionicons
                        name="mail"
                        size={20}
                        color={colors.foreground}
                      />
                    </View>
                    <YStack>
                      <Text
                        color={colors.foreground}
                        fontSize="$4"
                        fontWeight="500"
                      >
                        Nous contacter
                      </Text>
                      <Text
                        color={colors.mutedForeground}
                        fontSize="$2"
                        marginTop="$1"
                      >
                        Support technique et suggestions
                      </Text>
                    </YStack>
                  </XStack>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.foreground}
                  />
                </XStack>
              </ListItem>
              <ListItem
                backgroundColor="transparent"
                paddingVertical="$4"
                paddingHorizontal="$4"
                onPress={() => router.push("/test")}
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack space="$3" alignItems="center">
                    <View
                      backgroundColor={colors.accent}
                      borderRadius="$2"
                      padding="$2"
                    >
                      <Ionicons
                        name="document-text"
                        size={20}
                        color={colors.foreground}
                      />
                    </View>
                    <YStack>
                      <Text
                        color={colors.foreground}
                        fontSize="$4"
                        fontWeight="500"
                      >
                        Test
                      </Text>
                      <Text
                        color={colors.mutedForeground}
                        fontSize="$2"
                        marginTop="$1"
                      >
                        Test
                      </Text>
                    </YStack>
                  </XStack>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.foreground}
                  />
                </XStack>
              </ListItem>
            </View>
          </YStack>

          {/* Section Informations */}
          <YStack space="$3">
            <H2 color={colors.foreground} fontSize="$4" fontWeight="600">
              Informations
            </H2>

            <View
              backgroundColor={colors.card}
              borderRadius="$3"
              borderColor={colors.border}
              borderWidth={1}
              overflow="hidden"
            >
              <ListItem
                backgroundColor="transparent"
                borderBottomWidth={1}
                borderBottomColor={colors.border}
                paddingVertical="$4"
                paddingHorizontal="$4"
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text color={colors.foreground} fontSize="$4">
                    Version
                  </Text>
                  <Text
                    color={colors.mutedForeground}
                    fontSize="$3"
                    fontWeight="500"
                  >
                    1.0.0
                  </Text>
                </XStack>
              </ListItem>

              <ListItem
                backgroundColor="transparent"
                paddingVertical="$4"
                paddingHorizontal="$4"
              >
                <XStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text color={colors.foreground} fontSize="$4">
                    Développé par
                  </Text>
                  <Text
                    color={colors.mutedForeground}
                    fontSize="$3"
                    fontWeight="500"
                  >
                    Circl Team
                  </Text>
                </XStack>
              </ListItem>
            </View>
          </YStack>

          {/* Espace en bas */}
          <View height={50} />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
