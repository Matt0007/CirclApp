import React, { useState, useRef } from "react";
import { YStack, Text, XStack } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Dimensions, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useRouter } from "expo-router";
import {
  BasicProfileInput,
  CityInput,
  SportInput,
} from "../components/profileForm";
import ButtonGradient from "../components/common/ButtonGradient";

const { width: screenWidth } = Dimensions.get("window");

export default function CompleteProfilCombined() {
  const { colors } = useTheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  // État pour l'étape actuelle
  const [currentStep, setCurrentStep] = useState(1);

  // États pour l'étape 1
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [gender, setGender] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);

  // États pour l'étape 2
  const [city, setCity] = useState<string>("");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [isCityValid, setIsCityValid] = useState<boolean>(false);

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter((s) => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      // Validation de l'étape 1
      if (!gender || !birthDate) return;

      // Transition vers l'étape 2
      scrollViewRef.current?.scrollTo({ x: screenWidth, animated: true });
      setCurrentStep(2);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 2) {
      // Retour vers l'étape 1
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
      setCurrentStep(1);
    }
  };

  const handleFinish = () => {
    // Logique pour finaliser le profil
    console.log("Profil complété:", {
      profileImage,
      gender,
      birthDate,
      city,
      selectedSports,
    });
    // Rediriger vers la page principale
    router.replace("/(tabs)");
  };

  // Calcul de la progression basé sur l'étape actuelle
  const getProgressValue = () => {
    if (currentStep === 1) {
      return 0; // 0% pour l'étape 1
    } else {
      return 50; // 50% pour l'étape 2
    }
  };

  const isStep1Valid = gender && birthDate;
  const isStep2Valid = city && isCityValid && selectedSports.length > 0;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      {/* En-tête avec barre de progression */}
      <YStack padding="$5" paddingBottom="$4" space="$4">
        {/* Barre de progression */}
        <YStack space="$2">
          <View
            style={{
              height: 6,
              backgroundColor: colors.border,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${getProgressValue()}%`,
                height: "100%",
                backgroundColor: colors.primary,
                borderRadius: 3,
              }}
            />
          </View>
        </YStack>
        <YStack alignItems="center" space="$2">
          <Text
            fontSize={26}
            fontWeight="bold"
            color={colors.primary}
            textAlign="center"
          >
            Completez votre profil
          </Text>
        </YStack>
      </YStack>

      {/* Contenu principal avec scroll horizontal */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        {/* Étape 1 */}
        <View style={{ width: screenWidth }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            bounces={true}
          >
            <YStack flex={1} padding="$5" space="$6">
              <BasicProfileInput
                profileImage={profileImage}
                onProfileImageChange={setProfileImage}
                gender={gender}
                onGenderChange={setGender}
                birthDate={birthDate}
                onBirthDateChange={setBirthDate}
              />
            </YStack>
          </ScrollView>
        </View>

        {/* Étape 2 */}
        <View style={{ width: screenWidth }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            bounces={true}
          >
            <YStack flex={1} padding="$5" space="$6">
              <CityInput
                value={city}
                onChangeText={setCity}
                onCitySelect={(selectedCity) => {
                  console.log("Ville sélectionnée:", selectedCity);
                }}
                onValidationChange={setIsCityValid}
              />

              <SportInput
                selectedSports={selectedSports}
                onSportToggle={toggleSport}
              />
            </YStack>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Boutons de navigation */}
      <YStack
        padding="$5"
        paddingTop="$4"
        backgroundColor={colors.background}
        borderTopWidth={1}
        borderTopColor={colors.border}
        space="$3"
      >
        {currentStep === 1 ? (
          <ButtonGradient
            title="Continuer"
            onPress={goToNextStep}
            disabled={!isStep1Valid}
            size="large"
          />
        ) : (
          <XStack space="$4" width="100%">
            <View style={{ flex: 1, minWidth: 120 }}>
              <ButtonGradient
                title="Retour"
                onPress={goToPreviousStep}
                variant="secondary"
                size="large"
              />
            </View>
            <View style={{ flex: 1.5, minWidth: 160 }}>
              <ButtonGradient
                title="Finaliser le profil"
                onPress={handleFinish}
                disabled={!isStep2Valid}
                size="large"
              />
            </View>
          </XStack>
        )}
      </YStack>
    </SafeAreaView>
  );
}
