import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";
import { YStack, Text } from "tamagui";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../contexts/ThemeContext";

interface CityInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onCitySelect?: (city: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  placeholder?: string;
  label?: string;
}

export const CityInput: React.FC<CityInputProps> = ({
  value,
  onChangeText,
  onCitySelect,
  onValidationChange,
  placeholder = "Sélectionnez votre ville",
  label = "Ville",
}) => {
  const { colors } = useTheme();
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isValidCity, setIsValidCity] = useState<boolean>(false);

  const handleCityChange = async (text: string) => {
    setSearchQuery(text);

    if (text.length > 2) {
      setIsLoadingCities(true);
      try {
        // API officielle française pour les communes
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
            text
          )}&fields=nom,population&format=json&geometry=centre`
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            // Trier par population décroissante (villes d'abord, puis communes)
            const sortedCities = data
              .filter((item: any) =>
                item.nom.toLowerCase().includes(text.toLowerCase())
              )
              .sort((a: any, b: any) => {
                // Si pas de population, mettre à la fin
                if (!a.population && !b.population) return 0;
                if (!a.population) return 1;
                if (!b.population) return -1;
                // Trier par population décroissante
                return b.population - a.population;
              })
              .map((item: any) => item.nom)
              .slice(0, 20); // Limiter à 20 suggestions

            setCitySuggestions(sortedCities);
          } else {
            setCitySuggestions([]);
          }
        } else {
          // Fallback local en cas d'erreur
          const fallbackCities = [
            "Paris",
            "Marseille",
            "Lyon",
            "Toulouse",
            "Nice",
            "Nantes",
            "Strasbourg",
            "Bordeaux",
            "Lille",
            "Rennes",
            "Reims",
            "Saint-Étienne",
            "Toulon",
            "Le Havre",
            "Grenoble",
            "Dijon",
            "Angers",
            "Villeurbanne",
            "Le Mans",
            "Aix-en-Provence",
          ];

          const filteredCities = fallbackCities.filter((cityOption) =>
            cityOption.toLowerCase().includes(text.toLowerCase())
          );
          setCitySuggestions(filteredCities);
        }
      } catch {
        console.log("Erreur API, utilisation du fallback local");
        // Fallback local en cas d'erreur
        const fallbackCities = [
          "Paris",
          "Marseille",
          "Lyon",
          "Toulouse",
          "Nice",
          "Nantes",
          "Strasbourg",
          "Bordeaux",
          "Lille",
          "Rennes",
          "Reims",
          "Saint-Étienne",
          "Toulon",
          "Le Havre",
          "Grenoble",
          "Dijon",
          "Angers",
          "Villeurbanne",
          "Le Mans",
          "Aix-en-Provence",
        ];

        const filteredCities = fallbackCities.filter((cityOption) =>
          cityOption.toLowerCase().includes(text.toLowerCase())
        );
        setCitySuggestions(filteredCities);
      } finally {
        setIsLoadingCities(false);
      }
    } else {
      setCitySuggestions([]);
    }
  };

  const handleCitySelect = (cityOption: string) => {
    onChangeText(cityOption);
    setSearchQuery(cityOption);
    setIsValidCity(true);
    onValidationChange?.(true);
    setCitySuggestions([]);
    setShowDropdown(false);
    onCitySelect?.(cityOption);
  };

  const handleDropdownToggle = () => {
    if (!showDropdown) {
      setSearchQuery("");
      setCitySuggestions([]);
    }
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
    setCitySuggestions([]);
    setSearchQuery("");
    Keyboard.dismiss();
  };

  return (
    <YStack space="$3">
      <Text fontSize={18} fontWeight="600" color={colors.foreground}>
        {label}
      </Text>

      {/* Select avec recherche intégrée */}
      <View style={{ position: "relative" }}>
        <TouchableOpacity
          onPress={handleDropdownToggle}
          style={{
            width: "100%",
            padding: 16,
            borderWidth: 1,
            borderColor:
              value && isValidCity
                ? colors.primary // Vert quand ville valide
                : value && !isValidCity
                ? colors.destructive // Rouge quand ville invalide
                : colors.border, // Bordure normale par défaut
            borderRadius: 12,
            backgroundColor: colors.card,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Text
              color={value ? colors.foreground : colors.mutedForeground}
              fontSize={16}
              flex={1}
            >
              {value || placeholder}
            </Text>

            {/* Icône de validation */}
            {value && isValidCity && (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <MaterialCommunityIcons name="check" size={14} color="white" />
              </View>
            )}
          </View>

          <MaterialCommunityIcons
            name={showDropdown ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.mutedForeground}
          />
        </TouchableOpacity>

        {/* Overlay invisible pour fermer le dropdown */}
        {showDropdown && (
          <TouchableOpacity
            style={{
              position: "absolute",
              top: -1000,
              left: -1000,
              width: 2000,
              height: 2000,
              zIndex: 999,
            }}
            activeOpacity={0}
            onPress={closeDropdown}
          />
        )}

        {/* Dropdown avec recherche intégrée */}
        {showDropdown && (
          <View
            style={{
              position: "absolute",
              top: 60,
              left: 0,
              right: 0,
              backgroundColor: colors.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              zIndex: 1000,
              maxHeight: 300,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            {/* Barre de recherche intégrée */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                backgroundColor: colors.card,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={colors.mutedForeground}
                style={{ marginRight: 8 }}
              />
              <TextInput
                value={searchQuery}
                onChangeText={handleCityChange}
                placeholder="Rechercher une ville..."
                placeholderTextColor={colors.mutedForeground}
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.foreground,
                }}
                autoFocus={true}
              />
            </View>

            {/* Liste des villes */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              style={{ maxHeight: 200 }}
            >
              <YStack>
                {isLoadingCities ? (
                  <View
                    style={{
                      padding: 20,
                      alignItems: "center",
                    }}
                  >
                    <Text fontSize={14} color={colors.mutedForeground}>
                      🔍 Recherche en cours...
                    </Text>
                  </View>
                ) : citySuggestions.length > 0 ? (
                  citySuggestions.map((cityOption: string, index: number) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleCitySelect(cityOption)}
                      style={{
                        padding: 12,
                        borderBottomWidth:
                          index < citySuggestions.length - 1 ? 1 : 0,
                        borderBottomColor: colors.border,
                        backgroundColor:
                          cityOption === value
                            ? colors.primary + "20"
                            : "transparent",
                      }}
                    >
                      <Text
                        color={
                          cityOption === value
                            ? colors.primary
                            : colors.foreground
                        }
                        fontSize={14}
                        fontWeight="500"
                      >
                        {cityOption}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : searchQuery.length > 2 ? (
                  <View
                    style={{
                      padding: 20,
                      alignItems: "center",
                    }}
                  >
                    <Text fontSize={14} color={colors.mutedForeground}>
                      Aucune ville trouvée avec ce nom
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      padding: 20,
                      alignItems: "center",
                    }}
                  >
                    <Text fontSize={14} color={colors.mutedForeground}>
                      Tapez au moins 3 caractères pour rechercher
                    </Text>
                  </View>
                )}
              </YStack>
            </ScrollView>
          </View>
        )}
      </View>
    </YStack>
  );
};
