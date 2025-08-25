import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Text, View,  YStack, Button, H2, Input, Label } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";
import { BackHeader } from "../../components/common/BackHeader";

export default function EditProfile() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <BackHeader title="Modifier le profil" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$4" space="$6">
          {/* Section Informations personnelles */}
          <YStack space="$3">
            <H2 color={colors.foreground} fontSize="$4" fontWeight="600">
              Informations personnelles
            </H2>

            <View
              backgroundColor={colors.card}
              borderRadius="$3"
              borderColor={colors.border}
              borderWidth={1}
              padding="$4"
              space="$4"
            >
              <YStack space="$2">
                <Label color={colors.foreground} fontSize="$3" fontWeight="500">
                  Prénom
                </Label>
                <Input
                  backgroundColor={colors.input}
                  borderColor={colors.border}
                  color={colors.foreground}
                  placeholder="Votre prénom"
                  placeholderTextColor={colors.mutedForeground}
                />
              </YStack>

              <YStack space="$2">
                <Label color={colors.foreground} fontSize="$3" fontWeight="500">
                  Nom
                </Label>
                <Input
                  backgroundColor={colors.input}
                  borderColor={colors.border}
                  color={colors.foreground}
                  placeholder="Votre nom"
                  placeholderTextColor={colors.mutedForeground}
                />
              </YStack>

              <YStack space="$2">
                <Label color={colors.foreground} fontSize="$3" fontWeight="500">
                  Nom d&apos;utilisateur
                </Label>
                <Input
                  backgroundColor={colors.input}
                  borderColor={colors.border}
                  color={colors.foreground}
                  placeholder="@username"
                  placeholderTextColor={colors.mutedForeground}
                />
              </YStack>
            </View>
          </YStack>

          {/* Bouton de sauvegarde */}
          <Button
            backgroundColor={colors.primary}
            color={colors.primaryForeground}
            paddingVertical="$3"
            borderRadius="$3"
            onPress={() => console.log("Save Profile")}
          >
            <Text color={colors.primaryForeground} fontWeight="600">
              Sauvegarder les modifications
            </Text>
          </Button>

          {/* Espace en bas */}
          <View height={50} />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
