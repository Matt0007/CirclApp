import React, { useState, useRef } from "react";
import { YStack, Text, XStack } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Dimensions, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import {
  BasicProfileInput,
  CityInput,
  SportInput,
} from "../../components/profileForm";
import ButtonGradient from "../../components/common/ButtonGradient";
import { useCompleteProfile } from "../../hooks";

const { width: screenWidth } = Dimensions.get("window");

export default function CompleteProfilCombined() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { updateUserSports, updateProfileImage } = useAuth();
  const router = useRouter();

  // Désactiver le swipe retour
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        gestureEnabled: false,
      });
    }, [navigation])
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const { isSubmitting, completeProfile } = useCompleteProfile();

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

  const handleFinish = async () => {
    // Préparer les données du profil
    const profileData = {
      gender,
      birthDate,
      city,
      selectedSports,
      profileImage,
    };

    // Utiliser le hook pour finaliser le profil
    const success = await completeProfile(profileData);

    if (success) {
      // Mettre à jour l'image dans AuthContext si une image a été sélectionnée
      if (profileImage) {
        updateProfileImage(profileImage);
      }

      // Mettre à jour les sports dans AuthContext si des sports ont été sélectionnés
      if (selectedSports.length > 0) {
        // Créer les UserSport objects basés sur les sports sélectionnés
        const newUserSports = selectedSports.map((sportName, index) => ({
          id: `temp-${index}`, // ID temporaire
          userId: "current-user", // Sera remplacé par l'API
          sportId: `sport-${index}`, // Sera remplacé par l'API
          createdAt: new Date().toISOString(),
          sport: {
            id: `sport-${index}`,
            name: sportName,
            isActive: true,
          },
        }));

        // Mettre à jour AuthContext immédiatement
        updateUserSports(newUserSports);
      }

      // Rediriger vers la page de félicitations
      router.replace("/(formProfile)/profile-completed");
    }
  };

  // Calcul de la progression basé sur l'étape actuelle
  const getProgressValue = () => {
    if (currentStep === 1) {
      return 0; // 0% pour l'étape 1
    } else {
      return 50; // 50% pour l'étape 2
    }
  };

  const isStep1Valid = gender && birthDate ;
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
            {t("completeYourProfile")}
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
        keyboardShouldPersistTaps="handled"
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
            title={t("continue")}
            onPress={goToNextStep}
            disabled={!isStep1Valid}
            size="large"
          />
        ) : (
          <XStack space="$4" width="100%">
            <View style={{ flex: 1, minWidth: 120 }}>
              <ButtonGradient
                title={t("back")}
                onPress={goToPreviousStep}
                variant="secondary"
                size="large"
              />
            </View>
            <View style={{ flex: 1.5, minWidth: 160 }}>
              <ButtonGradient
                title={t("finalizeProfile")}
                onPress={handleFinish}
                disabled={!isStep2Valid}
                isLoading={isSubmitting}
                size="large"
              />
            </View>
          </XStack>
        )}
      </YStack>
    </SafeAreaView>
  );
}
