import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
  Alert,
} from "react-native";
import { YStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import ButtonGradient from "../common/ButtonGradient";
import * as ImagePicker from "expo-image-picker";

interface BasicProfileInputProps {
  profileImage: string | null;
  onProfileImageChange: (image: string | null) => void;
  gender: string;
  onGenderChange: (gender: string) => void;
  birthDate: Date | null;
  onBirthDateChange: (date: Date | null) => void;
}

export const BasicProfileInput: React.FC<BasicProfileInputProps> = ({
  profileImage,
  onProfileImageChange,
  gender,
  onGenderChange,
  birthDate,
  onBirthDateChange,
}) => {
  const { colors, colorScheme } = useTheme();
  const { t, locale } = useLocalization();
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    birthDate || new Date()
  );

  // Synchroniser selectedDate avec birthDate
  useEffect(() => {
    if (birthDate) {
      setSelectedDate(birthDate);
    }
  }, [birthDate]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onProfileImageChange(result.assets[0].uri);
      }
    } catch {
      Alert.alert(
        "Erreur",
        "Impossible de sélectionner l'image. Veuillez réessayer."
      );
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);

      // Sur Android, fermer directement la modal après sélection
      if (Platform.OS === "android") {
        onBirthDateChange(date);
        setShowDatePicker(false);
        setSelectedDate(birthDate || new Date());
      }
      // Sur iOS, garder la modal ouverte pour confirmation
    }
  };

  const confirmDate = () => {
    onBirthDateChange(selectedDate);
    setShowDatePicker(false);
    // Réinitialiser selectedDate pour éviter les conflits
    setSelectedDate(birthDate || new Date());
  };

  const cancelDate = () => {
    setShowDatePicker(false);
    // Réinitialiser selectedDate à la valeur actuelle
    setSelectedDate(birthDate || new Date());
  };

  const deleteProfileImage = () => {
    onProfileImageChange(null);
  };

  const formatDate = (date: Date) => {
    const dateLocale = locale === "fr" ? "fr-FR" : "en-US";
    return date.toLocaleDateString(dateLocale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <YStack space="$6">
      {/* Photo de profil */}
      <YStack space="$3" alignItems="center">
        <Text fontSize={18} fontWeight="600" color={colors.foreground}>
          {t("profilePhoto")}
        </Text>

        <TouchableOpacity onPress={pickImage}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
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
                width: 120,
                height: 120,
                borderRadius: 60,
              }}
            />

            {/* Cercle intérieur */}
            <View
              style={{
                width: 114,
                height: 114,
                borderRadius: 57,
                backgroundColor: colors.card,
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              {profileImage ? (
                <>
                  <Image
                    source={{ uri: profileImage }}
                    style={{
                      width: 114,
                      height: 114,
                      borderRadius: 57,
                    }}
                    resizeMode="cover"
                  />
                </>
              ) : (
                <Ionicons name="camera" size={40} color={colors.primary} />
              )}
            </View>

            {/* Icône poubelle en haut à droite */}
            {profileImage && (
              <TouchableOpacity
                onPress={deleteProfileImage}
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 3,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: colors.background,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                <Ionicons name="trash" size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </YStack>

      {/* Sexe */}
      <YStack space="$3">
        <Text fontSize={18} fontWeight="600" color={colors.foreground}>
          {t("gender")}
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => onGenderChange("Homme")}
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: gender === "Homme" ? colors.primary : colors.border,
              backgroundColor:
                gender === "Homme" ? colors.primary + "20" : colors.card,
              alignItems: "center",
            }}
          >
            <Ionicons
              name="male"
              size={24}
              color={
                gender === "Homme" ? colors.primary : colors.mutedForeground
              }
            />
            <Text
              fontSize={16}
              fontWeight="600"
              color={gender === "Homme" ? colors.primary : colors.foreground}
              marginTop={8}
            >
              {t("man")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onGenderChange("Femme")}
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: gender === "Femme" ? colors.primary : colors.border,
              backgroundColor:
                gender === "Femme" ? colors.primary + "20" : colors.card,
              alignItems: "center",
            }}
          >
            <Ionicons
              name="female"
              size={24}
              color={
                gender === "Femme" ? colors.primary : colors.mutedForeground
              }
            />
            <Text
              fontSize={16}
              fontWeight="600"
              color={gender === "Femme" ? colors.primary : colors.foreground}
              marginTop={8}
            >
              {t("woman")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onGenderChange("Autre")}
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: gender === "Autre" ? colors.primary : colors.border,
              backgroundColor:
                gender === "Autre" ? colors.primary + "20" : colors.card,
              alignItems: "center",
            }}
          >
            <Ionicons
              name="person"
              size={24}
              color={
                gender === "Autre" ? colors.primary : colors.mutedForeground
              }
            />
            <Text
              fontSize={16}
              fontWeight="600"
              color={gender === "Autre" ? colors.primary : colors.foreground}
              marginTop={8}
            >
              {t("other")}
            </Text>
          </TouchableOpacity>
        </View>
      </YStack>

      {/* Date de naissance */}
      <YStack space="$3">
        <Text fontSize={18} fontWeight="600" color={colors.foreground}>
          {t("birthDate")}
        </Text>

        <TouchableOpacity
          onPress={() => {
            console.log("Ouverture de la modal de date");
            setShowDatePicker(true);
          }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              color={birthDate ? colors.foreground : colors.mutedForeground}
              fontSize={16}
            >
              {birthDate ? formatDate(birthDate) : t("selectDate")}
            </Text>
            <Ionicons name="calendar" size={20} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Modal pour la sélection de date - iOS uniquement */}
        {Platform.OS === "ios" && (
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              setShowDatePicker(false);
              setSelectedDate(birthDate || new Date());
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 20,
                  padding: 24,
                  width: "100%",
                  maxWidth: 400,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.25,
                  shadowRadius: 20,
                  elevation: 10,
                }}
              >
                <Text
                  fontSize={20}
                  fontWeight="600"
                  color={colors.foreground}
                  marginBottom={20}
                >
                  {t("selectBirthDate")}
                </Text>

                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  themeVariant={colorScheme === "light" ? "light" : "dark"}
                  locale={locale === "fr" ? "fr-FR" : "en-US"}
                />

                <View
                  style={{
                    flexDirection: "row",
                    gap: 16,
                    marginTop: 20,
                    width: "100%",
                  }}
                >
                  <View style={{ flex: 1, minWidth: 100 }}>
                    <ButtonGradient
                      title={t("cancel")}
                      onPress={cancelDate}
                      variant="secondary"
                      size="medium"
                    />
                  </View>

                  <View style={{ flex: 1, minWidth: 100 }}>
                    <ButtonGradient
                      title={t("confirm")}
                      onPress={confirmDate}
                      size="medium"
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* DateTimePicker natif pour Android */}
        {Platform.OS === "android" && showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            locale={locale === "fr" ? "fr-FR" : "en-US"}
          />
        )}
      </YStack>
    </YStack>
  );
};
