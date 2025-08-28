import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Keyboard,
  Platform,
  Pressable,
} from "react-native";
import { YStack } from "tamagui";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../contexts/ThemeContext";

// Données fictives des villes françaises
const FRENCH_CITIES = [
  { id: 1, name: "Paris", region: "Île-de-France", population: 2161000 },
  {
    id: 2,
    name: "Marseille",
    region: "Provence-Alpes-Côte d'Azur",
    population: 861635,
  },
  { id: 3, name: "Lyon", region: "Auvergne-Rhône-Alpes", population: 513275 },
  { id: 4, name: "Toulouse", region: "Occitanie", population: 479553 },
  {
    id: 5,
    name: "Nice",
    region: "Provence-Alpes-Côte d'Azur",
    population: 342522,
  },
  { id: 6, name: "Nantes", region: "Pays de la Loire", population: 314138 },
  { id: 7, name: "Strasbourg", region: "Grand Est", population: 280966 },
  { id: 8, name: "Bordeaux", region: "Nouvelle-Aquitaine", population: 254436 },
  { id: 9, name: "Lille", region: "Hauts-de-France", population: 232440 },
  { id: 10, name: "Rennes", region: "Bretagne", population: 220488 },
  { id: 11, name: "Reims", region: "Grand Est", population: 180752 },
  {
    id: 12,
    name: "Saint-Étienne",
    region: "Auvergne-Rhône-Alpes",
    population: 172565,
  },
  {
    id: 13,
    name: "Toulon",
    region: "Provence-Alpes-Côte d'Azur",
    population: 171953,
  },
  { id: 14, name: "Le Havre", region: "Normandie", population: 166058 },
  {
    id: 15,
    name: "Grenoble",
    region: "Auvergne-Rhône-Alpes",
    population: 160779,
  },
  {
    id: 16,
    name: "Dijon",
    region: "Bourgogne-Franche-Comté",
    population: 158002,
  },
  { id: 17, name: "Angers", region: "Pays de la Loire", population: 154508 },
  {
    id: 18,
    name: "Villeurbanne",
    region: "Auvergne-Rhône-Alpes",
    population: 150659,
  },
  { id: 19, name: "Le Mans", region: "Pays de la Loire", population: 143599 },
  {
    id: 20,
    name: "Aix-en-Provence",
    region: "Provence-Alpes-Côte d'Azur",
    population: 143097,
  },
  { id: 21, name: "Brest", region: "Bretagne", population: 139456 },
  { id: 22, name: "Nîmes", region: "Occitanie", population: 146709 },
  { id: 23, name: "Limoges", region: "Nouvelle-Aquitaine", population: 130876 },
  {
    id: 24,
    name: "Clermont-Ferrand",
    region: "Auvergne-Rhône-Alpes",
    population: 143886,
  },
  { id: 25, name: "Tours", region: "Centre-Val de Loire", population: 137658 },
  { id: 26, name: "Amiens", region: "Hauts-de-France", population: 133625 },
  { id: 27, name: "Perpignan", region: "Occitanie", population: 119656 },
  { id: 28, name: "Metz", region: "Grand Est", population: 118489 },
  {
    id: 29,
    name: "Besançon",
    region: "Bourgogne-Franche-Comté",
    population: 117912,
  },
  {
    id: 30,
    name: "Orléans",
    region: "Centre-Val de Loire",
    population: 116269,
  },
];

interface City {
  id: number;
  name: string;
  region: string;
  population: number;
}

export default function TestOld() {
  const { colors } = useTheme();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState<City[]>(FRENCH_CITIES);
  const searchInputRef = useRef<TextInput>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCities(FRENCH_CITIES);
    } else {
      const filtered = FRENCH_CITIES.filter(
        (city) =>
          city.name.toLowerCase().includes(query.toLowerCase()) ||
          city.region.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  };

  const handleCitySelect = (city: City) => {
    console.log("handleCitySelect appelé avec:", city);
    setSelectedCity(city);
    setIsDropdownOpen(false);
    setSearchQuery("");
    console.log("État mis à jour - selectedCity:", city.name);
  };

  const toggleDropdown = () => {
    console.log("toggleDropdown appelé, état actuel:", isDropdownOpen);
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setSearchQuery("");
      setFilteredCities(FRENCH_CITIES);
      // Focus sur l'input de recherche après un délai pour iOS
      if (Platform.OS === "ios") {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 300);
      }
    }
  };

  // Fonction pour fermer le clavier et le dropdown
  const closeKeyboardAndDropdown = () => {
    console.log("Fermeture du clavier et du dropdown");
    Keyboard.dismiss();
    setIsDropdownOpen(false);
    setSearchQuery("");
    // Focus sur l'input pour éviter les conflits
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  // Fonction alternative pour iOS qui évite les conflits de clavier
  const handleCitySelectIOS = (city: City) => {
    console.log("Sélection iOS de ville:", city.name);

    // Fermer le clavier immédiatement
    searchInputRef.current?.blur();
    Keyboard.dismiss();

    // Attendre que le clavier soit complètement fermé
    setTimeout(() => {
      console.log("Mise à jour de l'état après fermeture du clavier");
      setSelectedCity(city);
      setIsDropdownOpen(false);
      setSearchQuery("");
    }, 300);
  };

  // Fonction de sélection adaptée à la plateforme
  const handleCitySelection = (city: City) => {
    if (Platform.OS === "ios") {
      handleCitySelectIOS(city);
    } else {
      handleCitySelect(city);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Overlay de fermeture pour tout l'écran */}
      {isDropdownOpen && (
        <Pressable
          style={styles.fullScreenOverlay}
          onPress={closeKeyboardAndDropdown}
        />
      )}

      <Text style={[styles.title, { color: colors.foreground }]}>
        Test - Sélecteur de Ville
      </Text>

      <YStack space="$4" style={styles.form}>
        {/* Label */}
        <Text style={[styles.label, { color: colors.foreground }]}>Ville</Text>

        {/* Select Container */}
        <View style={styles.selectContainer}>
          {/* Select Button */}
          <TouchableOpacity
            style={[
              styles.selectButton,
              {
                backgroundColor: colors.card,
                borderColor: selectedCity ? colors.primary : colors.border,
                borderWidth: selectedCity ? 2 : 1,
                shadowColor: colors.primary,
                shadowOpacity: selectedCity ? 0.15 : 0.05,
                shadowRadius: selectedCity ? 8 : 2,
                elevation: selectedCity ? 4 : 2,
              },
              selectedCity && styles.selectButtonSelected,
            ]}
            onPress={toggleDropdown}
            activeOpacity={0.7}
          >
            <View style={styles.selectButtonContent}>
              {selectedCity ? (
                <View style={styles.selectedCityInfo}>
                  <Text
                    style={[
                      styles.selectedCityName,
                      { color: colors.primary, fontWeight: "700" },
                    ]}
                  >
                    {selectedCity.name}
                  </Text>
                  <Text
                    style={[
                      styles.selectedCityRegion,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {selectedCity.region}
                  </Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.placeholder,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Sélectionnez votre ville
                </Text>
              )}

              {/* Validation Icon */}
              {selectedCity && (
                <View style={styles.validationIcon}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={colors.primary}
                  />
                </View>
              )}
            </View>

            <MaterialCommunityIcons
              name={isDropdownOpen ? "chevron-up" : "chevron-down"}
              size={24}
              color={selectedCity ? colors.primary : colors.mutedForeground}
            />
          </TouchableOpacity>

          {/* Overlay invisible pour fermer le dropdown quand on clique en dehors */}
          {isDropdownOpen && (
            <Pressable
              style={styles.overlay}
              onPress={closeKeyboardAndDropdown}
            />
          )}

          {/* Dropdown */}
          {isDropdownOpen && (
            <View
              style={[
                styles.dropdown,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: colors.primary,
                },
              ]}
            >
              {/* Header avec bouton de fermeture */}
              <View
                style={[
                  styles.dropdownHeader,
                  { borderBottomColor: colors.border },
                ]}
              >
                <Text
                  style={[styles.dropdownTitle, { color: colors.foreground }]}
                >
                  Sélectionner une ville
                </Text>
                <TouchableOpacity
                  onPress={closeKeyboardAndDropdown}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              <View
                style={[
                  styles.searchContainer,
                  {
                    borderBottomColor: colors.border,
                    backgroundColor: colors.input,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  color={colors.mutedForeground}
                />
                <TextInput
                  style={[styles.searchInput, { color: colors.foreground }]}
                  placeholder="Rechercher une ville..."
                  placeholderTextColor={colors.mutedForeground}
                  value={searchQuery}
                  onChangeText={handleSearch}
                  autoFocus={false}
                  onBlur={() => console.log("TextInput onBlur")}
                  onSubmitEditing={() =>
                    console.log("TextInput onSubmitEditing")
                  }
                  ref={searchInputRef}
                />
              </View>

              {/* Cities List */}
              <ScrollView
                style={styles.citiesList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={
                  Platform.OS === "ios" ? "interactive" : "on-drag"
                }
                onScrollBeginDrag={() => {
                  if (Platform.OS === "ios") {
                    searchInputRef.current?.blur();
                  }
                }}
              >
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <TouchableOpacity
                      key={city.id}
                      style={[
                        styles.cityItem,
                        { borderBottomColor: colors.border },
                        selectedCity?.id === city.id && [
                          styles.cityItemSelected,
                          {
                            backgroundColor: colors.accent,
                            paddingLeft: 16, // Remettre le padding normal
                          },
                        ],
                      ]}
                      onPress={() => handleCitySelection(city)}
                      onPressIn={() => console.log("Appui sur:", city.name)}
                      activeOpacity={0.7}
                      delayPressIn={Platform.OS === "ios" ? 0 : 0}
                      delayPressOut={Platform.OS === "ios" ? 0 : 0}
                    >
                      <View style={styles.cityItemContent}>
                        <Text
                          style={[
                            styles.cityItemName,
                            { color: colors.foreground },
                            selectedCity?.id === city.id && [
                              styles.cityItemNameSelected,
                              {
                                color: colors.primary,
                                fontWeight: "700",
                              },
                            ],
                          ]}
                        >
                          {city.name}
                        </Text>
                        <View style={styles.cityItemDetails}>
                          <Text
                            style={[
                              styles.cityItemRegion,
                              { color: colors.mutedForeground },
                              selectedCity?.id === city.id && {
                                color: colors.primary,
                              },
                            ]}
                          >
                            {city.region}
                          </Text>
                          <Text
                            style={[
                              styles.cityItemPopulation,
                              {
                                color: colors.mutedForeground,
                                backgroundColor:
                                  selectedCity?.id === city.id
                                    ? colors.primary + "20"
                                    : colors.accent,
                              },
                            ]}
                          >
                            {city.population.toLocaleString()} hab.
                          </Text>
                        </View>
                      </View>

                      {selectedCity?.id === city.id && (
                        <View style={styles.selectionIndicator}>
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={24}
                            color={colors.primary}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noResults}>
                    <Text
                      style={[
                        styles.noResultsText,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Aucune ville trouvée
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Debug Info */}
        <View
          style={[
            styles.debugContainer,
            {
              backgroundColor: colors.accent,
              borderColor: colors.primary,
            },
          ]}
        >
          <Text style={[styles.debugTitle, { color: colors.primary }]}>
            Debug Info:
          </Text>
          <Text style={[styles.debugText, { color: colors.foreground }]}>
            Dropdown ouvert: {isDropdownOpen ? "OUI" : "NON"}
          </Text>
          <Text style={[styles.debugText, { color: colors.foreground }]}>
            Ville sélectionnée: {selectedCity ? selectedCity.name : "Aucune"}
          </Text>
          <Text style={[styles.debugText, { color: colors.foreground }]}>
            Recherche: &quot;{searchQuery}&quot;
          </Text>
          <Text style={[styles.debugText, { color: colors.foreground }]}>
            Villes filtrées: {filteredCities.length}
          </Text>
        </View>

        {/* Selected City Display */}
        {selectedCity && (
          <View style={styles.selectedCityDisplay}>
            <Text
              style={[styles.selectedCityTitle, { color: colors.foreground }]}
            >
              Ville sélectionnée :
            </Text>
            <View
              style={[
                styles.selectedCityCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.selectedCityCardName,
                  { color: colors.foreground },
                ]}
              >
                {selectedCity.name}
              </Text>
              <Text
                style={[
                  styles.selectedCityCardRegion,
                  { color: colors.mutedForeground },
                ]}
              >
                {selectedCity.region}
              </Text>
              <Text
                style={[
                  styles.selectedCityCardPopulation,
                  {
                    color: colors.mutedForeground,
                    backgroundColor: colors.accent,
                  },
                ]}
              >
                Population : {selectedCity.population.toLocaleString()}{" "}
                habitants
              </Text>
            </View>
          </View>
        )}
      </YStack>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  selectContainer: {
    position: "relative",
    zIndex: 1000,
  },
  selectButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectButtonSelected: {
    // Styles spécifiques pour l'état sélectionné
  },
  selectButtonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedCityInfo: {
    flex: 1,
  },
  selectedCityName: {
    fontSize: 16,
    fontWeight: "600",
  },
  selectedCityRegion: {
    fontSize: 14,
    marginTop: 2,
  },
  placeholder: {
    fontSize: 16,
  },
  validationIcon: {
    marginRight: 12,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 400,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  citiesList: {
    maxHeight: 300,
  },
  cityItem: {
    padding: 16,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cityItemSelected: {
    // Styles spécifiques pour l'état sélectionné
    transform: [{ scale: 1.02 }],
  },
  cityItemContent: {
    flex: 1,
  },
  cityItemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cityItemNameSelected: {
    // Styles spécifiques pour l'état sélectionné
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cityItemDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityItemRegion: {
    fontSize: 14,
    marginRight: 12,
  },
  cityItemPopulation: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  noResults: {
    padding: 20,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
  },
  selectedCityDisplay: {
    marginTop: 20,
  },
  selectedCityTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  selectedCityCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedCityCardName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  selectedCityCardRegion: {
    fontSize: 16,
    marginBottom: 8,
  },
  selectedCityCardPopulation: {
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  debugContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  debugText: {
    fontSize: 14,
    marginBottom: 4,
  },
  selectionIndicator: {
    marginLeft: 12,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 999,
  },
  fullScreenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 998,
  },
});
