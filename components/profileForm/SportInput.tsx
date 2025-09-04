import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ScrollView,
  Keyboard,
  Animated,
  Platform,
} from "react-native";
import { YStack, Text } from "tamagui";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import ButtonGradient from "../common/ButtonGradient";
import ConfirmationModal from "../common/ConfirmationModal";
import { API_BASE_URL } from "../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Interface pour les sports de l'API
interface SportDB {
  id: string;
  name: string;
  isActive: boolean;
}
interface Sport {
  name: string;
  icon: string;
  library: "MaterialCommunityIcons" | "MaterialIcons";
  category: string;
}

interface SportInputProps {
  selectedSports: string[];
  onSportToggle: (sport: string) => void;
  sports?: Sport[];
  label?: string;
  description?: string;
}

export const SportInput: React.FC<SportInputProps> = ({
  selectedSports,
  onSportToggle,
  sports = [
    // Sports de ballon
    {
      name: "football",
      icon: "soccer",
      library: "MaterialCommunityIcons",
      category: "Sports de ballon",
    },
    {
      name: "basketball",
      icon: "basketball",
      library: "MaterialCommunityIcons",
      category: "Sports de ballon",
    },
    {
      name: "tennis",
      icon: "tennis",
      library: "MaterialCommunityIcons",
      category: "Sports de ballon",
    },
    {
      name: "volleyball",
      icon: "volleyball",
      library: "MaterialCommunityIcons",
      category: "Sports de ballon",
    },
    {
      name: "rugby",
      icon: "sports-rugby",
      library: "MaterialIcons",
      category: "Sports de ballon",
    },

    // Sports d'endurance
    {
      name: "running",
      icon: "directions-run",
      library: "MaterialIcons",
      category: "Sports d'endurance",
    },
    {
      name: "cycling",
      icon: "directions-bike",
      library: "MaterialIcons",
      category: "Sports d'endurance",
    },
    {
      name: "swimming",
      icon: "pool",
      library: "MaterialIcons",
      category: "Sports d'endurance",
    },
    {
      name: "hiking",
      icon: "hiking",
      library: "MaterialCommunityIcons",
      category: "Sports d'endurance",
    },
    {
      name: "triathlon",
      icon: "timer",
      library: "MaterialIcons",
      category: "Sports d'endurance",
    },

    // Sports de combat
    {
      name: "boxing",
      icon: "boxing-glove",
      library: "MaterialCommunityIcons",
      category: "Sports de combat",
    },
    {
      name: "judo",
      icon: "karate",
      library: "MaterialCommunityIcons",
      category: "Sports de combat",
    },
    {
      name: "karate",
      icon: "karate",
      library: "MaterialCommunityIcons",
      category: "Sports de combat",
    },
    {
      name: "mma",
      icon: "karate",
      library: "MaterialCommunityIcons",
      category: "Sports de combat",
    },

    // Fitness & Musculation
    {
      name: "weightlifting",
      icon: "dumbbell",
      library: "MaterialCommunityIcons",
      category: "Fitness",
    },
    {
      name: "crossfit",
      icon: "weight-lifter",
      library: "MaterialCommunityIcons",
      category: "Fitness",
    },
    {
      name: "pilates",
      icon: "yoga",
      library: "MaterialCommunityIcons",
      category: "Fitness",
    },
    {
      name: "yoga",
      icon: "yoga",
      library: "MaterialCommunityIcons",
      category: "Fitness",
    },

    // Sports de glisse
    {
      name: "skiing",
      icon: "ski",
      library: "MaterialCommunityIcons",
      category: "Sports de glisse",
    },
    {
      name: "snowboard",
      icon: "snowboard",
      library: "MaterialCommunityIcons",
      category: "Sports de glisse",
    },
    {
      name: "surfing",
      icon: "surfing",
      library: "MaterialCommunityIcons",
      category: "Sports de glisse",
    },
    {
      name: "skateboard",
      icon: "skateboard",
      library: "MaterialCommunityIcons",
      category: "Sports de glisse",
    },

    // Autres
    {
      name: "climbing",
      icon: "trending-up",
      library: "MaterialIcons",
      category: "Autres",
    },
    {
      name: "dance",
      icon: "human-female-dance",
      library: "MaterialCommunityIcons",
      category: "Autres",
    },
    {
      name: "golf",
      icon: "sports-golf",
      library: "MaterialIcons",
      category: "Autres",
    },
    {
      name: "fencing",
      icon: "sports-martial-arts",
      library: "MaterialIcons",
      category: "Autres",
    },
  ],
  label = "Sports pratiqués",
  description = "Sélectionnez tous les sports que vous pratiquez",
}) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sportToDelete, setSportToDelete] = useState<string>("");
  const [selectedSport, setSelectedSport] = useState<SportDB | null>(null);
  const [customSports, setCustomSports] = useState<Sport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<SportDB[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const translateYAnim = useRef(new Animated.Value(0)).current;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Gestion du clavier pour ajuster la position de la modal avec animation fluide
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        const targetY = -e.endCoordinates.height * 0.4;
        Animated.timing(translateYAnim, {
          toValue: targetY,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [translateYAnim]);

  // Combiner les sports par défaut avec les sports personnalisés
  const allSports = [...sports, ...customSports];

  // Fonction pour traduire le nom du sport
  const getTranslatedSportName = (sportName: string): string => {
    // Convertir le nom en clé de traduction (ex: "football" -> "football")
    const sportKey = sportName.toLowerCase() as keyof typeof t;
    const translation = t(sportKey);
    return translation || sportName;
  };

  // Fonction pour rendre l'icône appropriée selon la bibliothèque
  const renderIcon = (sport: Sport, size: number, color: string) => {
    if (sport.library === "MaterialCommunityIcons") {
      return (
        <MaterialCommunityIcons
          name={sport.icon as any}
          size={size}
          color={color}
        />
      );
    } else {
      return (
        <MaterialIcons name={sport.icon as any} size={size} color={color} />
      );
    }
  };

  // Fonction pour rechercher des sports via l'API
  const searchSports = async (query: string) => {
    if (!query.trim() || query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Récupérer le token d'authentification
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("🔍 Token non trouvé");
        setSearchResults([]);
        return;
      }

      const searchUrl = `${API_BASE_URL}/sports/search?query=${encodeURIComponent(
        query.trim()
      )}&limit=15`;

      console.log("🔍 Recherche sports:", searchUrl);

      const response = await fetch(searchUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("🔍 Status response:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("🔍 Données reçues:", data);

        // Filtrer les sports déjà affichés dans la liste principale
        const filteredData = data.filter(
          (apiSport: SportDB) =>
            !sports.some(
              (sport) =>
                sport.name.toLowerCase() === apiSport.name.toLowerCase()
            )
        );

        console.log("🔍 Données filtrées:", filteredData);
        setSearchResults(filteredData);
      } else {
        console.error("🔍 Erreur API:", response.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("🔍 Erreur lors de la recherche des sports:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Fonction pour filtrer les sports selon la recherche (maintenue pour compatibilité)
  const getFilteredSports = () => {
    return searchResults;
  };

  // Fonction pour sélectionner un sport
  const handleSelectSport = (sport: SportDB) => {
    setSelectedSport(sport);
    setShowDropdown(false);
    setSearchQuery(sport.name);
  };

  // Fonction pour ajouter le sport sélectionné
  const handleAddSelectedSport = () => {
    if (!selectedSport) {
      return;
    }

    // Vérifier si le sport existe déjà
    const sportExists = allSports.some(
      (sport) => sport.name.toLowerCase() === selectedSport.name.toLowerCase()
    );

    if (sportExists) {
      return;
    }

    // Créer le nouveau sport avec les données de la BDD
    const newSport: Sport = {
      name: selectedSport.name,
      icon: "plus", // Icône par défaut
      library: "MaterialCommunityIcons",
      category: "Autre", // Catégorie par défaut pour les sports ajoutés
    };

    setCustomSports((prev) => [...prev, newSport]);
    setSelectedSport(null);
    setSearchQuery("");
    setShowDropdown(false);
    setShowModal(false);

    // Sélectionner automatiquement le nouveau sport
    onSportToggle(newSport.name);
  };

  const handleRemoveCustomSport = (sportName: string) => {
    setSportToDelete(sportName);
    setShowDeleteModal(true);
  };

  const confirmDeleteSport = () => {
    if (sportToDelete) {
      setCustomSports((prev) =>
        prev.filter((sport) => sport.name !== sportToDelete)
      );
      // Désélectionner le sport s'il était sélectionné
      if (selectedSports.includes(sportToDelete)) {
        onSportToggle(sportToDelete);
      }
      setSportToDelete("");
    }
  };

  return (
    <YStack space="$3">
      <Text fontSize={18} fontWeight="600" color={colors.foreground}>
        {t("practicedSports")}
      </Text>

      <Text fontSize={14} color={colors.mutedForeground} marginBottom="$2">
        {t("selectSportsDescription")}
      </Text>

      {/* Tous les sports sur une seule ligne */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {allSports.map((sport) => (
          <TouchableOpacity
            key={sport.name}
            onPress={() => onSportToggle(sport.name)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: selectedSports.includes(sport.name)
                ? colors.primary
                : colors.border,
              backgroundColor: selectedSports.includes(sport.name)
                ? colors.primary + "20"
                : colors.card,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              minWidth: 100,
              justifyContent: "center",
              position: "relative",
              shadowColor: selectedSports.includes(sport.name)
                ? colors.primary
                : "transparent",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: selectedSports.includes(sport.name) ? 0.3 : 0,
              shadowRadius: 4,
              elevation: selectedSports.includes(sport.name) ? 4 : 0,
            }}
          >
            {renderIcon(sport, 16, colors.primary)}
            <Text
              color={
                selectedSports.includes(sport.name)
                  ? colors.primary
                  : colors.foreground
              }
              fontSize={13}
              fontWeight="600"
            >
              {getTranslatedSportName(sport.name)}
            </Text>

            {/* Bouton de suppression pour les sports ajoutés via "Autre" */}
            {customSports.some((cs) => cs.name === sport.name) && (
              <TouchableOpacity
                onPress={() => handleRemoveCustomSport(sport.name)}
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "white",
                  borderWidth: 2,
                  borderColor: colors.destructive || "#ef4444",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={12}
                  color={colors.destructive || "#ef4444"}
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}

        {/* Bouton "Autre" pour ajouter des sports personnalisés */}
        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
            // Reset des états de recherche à l'ouverture
            setSearchQuery("");
            setSearchResults([]);
            setSelectedSport(null);
            setShowDropdown(false);
          }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: colors.primary,
            backgroundColor: colors.primary + "20",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            minWidth: 100,
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="plus"
            size={16}
            color={colors.primary}
          />
          <Text color={colors.primary} fontSize={13} fontWeight="600">
            {t("other")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal pour ajouter un sport */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: 20,
          }}
          activeOpacity={1}
          onPress={() => {
            setShowModal(false);
            setShowDropdown(false);
            // Reset complet des états à la fermeture
            setSearchQuery("");
            setSearchResults([]);
            setSelectedSport(null);
            // Annuler le timeout de recherche en cours
            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
            }
          }}
        >
          <Animated.View
            style={{
              backgroundColor: colors.background,
              borderRadius: 20,
              padding: 24,
              width: "100%",
              maxWidth: 500,
              maxHeight: Platform.OS === "ios" ? "70%" : "80%",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 10,
              transform: [
                {
                  translateY: translateYAnim,
                },
              ],
            }}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <Text
              fontSize={20}
              fontWeight="600"
              color={colors.foreground}
              marginBottom={20}
            >
              {t("addSportFromDB")}
            </Text>

            {/* Select avec recherche intégrée */}
            <View style={{ width: "100%", position: "relative" }}>
              <TouchableOpacity
                onPress={() => {
                  if (!showDropdown) {
                    setSearchQuery("");
                  }
                  setShowDropdown(!showDropdown);
                }}
                style={{
                  width: "100%",
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  backgroundColor: colors.card,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <Text
                  color={
                    selectedSport ? colors.foreground : colors.mutedForeground
                  }
                  fontSize={16}
                  flex={1}
                  textAlign="left"
                >
                  {selectedSport ? selectedSport.name : t("selectSport")}
                </Text>
                <MaterialCommunityIcons
                  name={showDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.mutedForeground}
                />
              </TouchableOpacity>

              {/* Dropdown avec recherche intégrée */}
              {showDropdown && (
                <>
                  {/* Overlay invisible pour fermer le dropdown - couvre seulement la zone du select */}
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: -20,
                      left: -20,
                      right: -20,
                      bottom: -20,
                      backgroundColor: "transparent",
                      zIndex: 999,
                    }}
                    activeOpacity={0}
                    onPress={() => setShowDropdown(false)}
                  />

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
                      maxHeight: 250,
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
                        onChangeText={(text) => {
                          setSearchQuery(text);

                          // Debouncing : annuler la requête précédente
                          if (searchTimeoutRef.current) {
                            clearTimeout(searchTimeoutRef.current);
                          }

                          if (text.length > 2) {
                            // Activer le loading immédiatement
                            setIsSearching(true);
                          } else {
                            setIsSearching(false);
                          }

                          // Lancer la recherche après 400ms d'inactivité
                          searchTimeoutRef.current = setTimeout(() => {
                            searchSports(text);
                          }, 400);
                        }}
                        placeholder={t("searchSport")}
                        placeholderTextColor={colors.mutedForeground}
                        style={{
                          flex: 1,
                          fontSize: 16,
                          color: colors.foreground,
                        }}
                        autoFocus={true}
                      />
                    </View>

                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="always"
                      style={{ maxHeight: 200 }}
                    >
                      {isSearching ? (
                        <View
                          style={{
                            padding: 20,
                            alignItems: "center",
                          }}
                        >
                          <Text fontSize={14} color={colors.mutedForeground}>
                            {t("searchInProgress")}
                          </Text>
                        </View>
                      ) : getFilteredSports().length > 0 ? (
                        getFilteredSports().map((sport, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => handleSelectSport(sport)}
                            style={{
                              padding: 12,
                              borderBottomWidth:
                                index < getFilteredSports().length - 1 ? 1 : 0,
                              borderBottomColor: colors.border,
                              backgroundColor:
                                selectedSport?.name === sport.name
                                  ? colors.primary + "20"
                                  : "transparent",
                            }}
                          >
                            <Text
                              color={colors.foreground}
                              fontSize={14}
                              fontWeight="500"
                            >
                              {sport.name}
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
                            {t("noSportFound")}
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
                            {t("type3Characters")}
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 16, // Augmenté l'espace entre les boutons
                width: "100%",
                marginTop: 20,
              }}
            >
              <View style={{ flex: 1, minWidth: 120 }}>
                {/* Largeur minimale pour éviter la coupure */}
                <ButtonGradient
                  onPress={() => {
                    setSelectedSport(null);
                    setSearchQuery("");
                    setSearchResults([]);
                    setShowDropdown(false);
                    setShowModal(false);
                    // Annuler le timeout de recherche en cours
                    if (searchTimeoutRef.current) {
                      clearTimeout(searchTimeoutRef.current);
                    }
                  }}
                  title={t("cancel")}
                  variant="secondary"
                  size="medium"
                />
              </View>

              <View style={{ flex: 1, minWidth: 120 }}>
                {/* Largeur minimale pour éviter la coupure */}
                <ButtonGradient
                  title={t("add")}
                  onPress={handleAddSelectedSport}
                  size="medium"
                  disabled={!selectedSport}
                />
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteSport}
        title={t("removeSport")}
        message={`${t("removeSportConfirm")} "${sportToDelete}" ?`}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        confirmVariant="destructive"
      />
    </YStack>
  );
};
