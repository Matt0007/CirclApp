import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Keyboard,
  Animated,
  Platform,
} from "react-native";
import { YStack, Text } from "tamagui";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../../contexts/ThemeContext";
import ButtonGradient from "../common/ButtonGradient";
import { SPORTS_DATABASE, type SportDB } from "../../data/sportsDatabase";

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
      name: "Football",
      icon: "soccer",
      library: "MaterialCommunityIcons",
      category: "Sports de ballon",
    },
    {
      name: "Basketball",
      icon: "basketball",
      library: "MaterialCommunityIcons",
      category: "Sports de ballon",
    },
    {
      name: "Tennis",
      icon: "tennis",
      library: "MaterialCommunityIcons",
      category: "Sports de ballon",
    },
    {
      name: "Volley",
      icon: "volleyball",
      library: "MaterialCommunityIcons",
      category: "Sports de ballon",
    },
    {
      name: "Rugby",
      icon: "sports-rugby",
      library: "MaterialIcons",
      category: "Sports de ballon",
    },

    // Sports d'endurance
    {
      name: "Course à pied",
      icon: "directions-run",
      library: "MaterialIcons",
      category: "Sports d'endurance",
    },
    {
      name: "Vélo",
      icon: "directions-bike",
      library: "MaterialIcons",
      category: "Sports d'endurance",
    },
    {
      name: "Natation",
      icon: "pool",
      library: "MaterialIcons",
      category: "Sports d'endurance",
    },
    {
      name: "Randonnée",
      icon: "hiking",
      library: "MaterialCommunityIcons",
      category: "Sports d'endurance",
    },
    {
      name: "Triathlon",
      icon: "timer",
      library: "MaterialIcons",
      category: "Sports d'endurance",
    },

    // Sports de combat
    {
      name: "Boxe",
      icon: "boxing-glove",
      library: "MaterialCommunityIcons",
      category: "Sports de combat",
    },
    {
      name: "Judo",
      icon: "karate",
      library: "MaterialCommunityIcons",
      category: "Sports de combat",
    },
    {
      name: "Karaté",
      icon: "karate",
      library: "MaterialCommunityIcons",
      category: "Sports de combat",
    },
    {
      name: "MMA",
      icon: "karate",
      library: "MaterialCommunityIcons",
      category: "Sports de combat",
    },

    // Fitness & Musculation
    {
      name: "Musculation",
      icon: "dumbbell",
      library: "MaterialCommunityIcons",
      category: "Fitness",
    },
    {
      name: "CrossFit",
      icon: "weight-lifter",
      library: "MaterialCommunityIcons",
      category: "Fitness",
    },
    {
      name: "Pilates",
      icon: "yoga",
      library: "MaterialCommunityIcons",
      category: "Fitness",
    },
    {
      name: "Yoga",
      icon: "yoga",
      library: "MaterialCommunityIcons",
      category: "Fitness",
    },

    // Sports de glisse
    {
      name: "Ski",
      icon: "ski",
      library: "MaterialCommunityIcons",
      category: "Sports de glisse",
    },
    {
      name: "Snowboard",
      icon: "snowboard",
      library: "MaterialCommunityIcons",
      category: "Sports de glisse",
    },
    {
      name: "Surf",
      icon: "surfing",
      library: "MaterialCommunityIcons",
      category: "Sports de glisse",
    },
    {
      name: "Skateboard",
      icon: "skateboard",
      library: "MaterialCommunityIcons",
      category: "Sports de glisse",
    },

    // Autres
    {
      name: "Escalade",
      icon: "trending-up",
      library: "MaterialIcons",
      category: "Autres",
    },
    {
      name: "Danse",
      icon: "human-female-dance",
      library: "MaterialCommunityIcons",
      category: "Autres",
    },
    {
      name: "Golf",
      icon: "sports-golf",
      library: "MaterialIcons",
      category: "Autres",
    },
    {
      name: "Escrime",
      icon: "sports-martial-arts",
      library: "MaterialIcons",
      category: "Autres",
    },
  ],
  label = "Sports pratiqués",
  description = "Sélectionnez tous les sports que vous pratiquez",
}) => {
  const { colors } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState<SportDB | null>(null);
  const [customSports, setCustomSports] = useState<Sport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const translateYAnim = useRef(new Animated.Value(0)).current;

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

  // Fonction pour filtrer les sports selon la recherche
  const getFilteredSports = () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      return []; // Retourner un tableau vide si moins de 3 caractères
    }

    return SPORTS_DATABASE.filter(
      (sport) =>
        sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sport.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 15); // Limiter à 15 résultats de recherche
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
      Alert.alert("Erreur", "Veuillez sélectionner un sport");
      return;
    }

    // Vérifier si le sport existe déjà
    const sportExists = allSports.some(
      (sport) => sport.name.toLowerCase() === selectedSport.name.toLowerCase()
    );

    if (sportExists) {
      Alert.alert("Erreur", "Ce sport existe déjà dans la liste");
      return;
    }

    // Créer le nouveau sport avec les données de la BDD
    const newSport: Sport = {
      name: selectedSport.name,
      icon: "plus", // Icône par défaut
      library: "MaterialCommunityIcons",
      category: selectedSport.category,
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
    Alert.alert(
      "Supprimer le sport",
      `Voulez-vous vraiment supprimer "${sportName}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            setCustomSports((prev) =>
              prev.filter((sport) => sport.name !== sportName)
            );
            // Désélectionner le sport s'il était sélectionné
            if (selectedSports.includes(sportName)) {
              onSportToggle(sportName);
            }
          },
        },
      ]
    );
  };

  return (
    <YStack space="$3">
      <Text fontSize={18} fontWeight="600" color={colors.foreground}>
        {label}
      </Text>

      <Text fontSize={14} color={colors.mutedForeground} marginBottom="$2">
        {description}
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
              {sport.name}
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
          onPress={() => setShowModal(true)}
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
            Autre
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal pour ajouter un sport */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          activeOpacity={1}
          onPress={() => {
            setShowModal(false);
            setShowDropdown(false); // Fermer aussi le select
          }}
        >
          <Animated.View
            style={{
              backgroundColor: colors.background,
              borderRadius: 16,
              padding: 20,
              width: "90%",
              maxHeight: Platform.OS === "ios" ? "70%" : "80%",
              alignItems: "center",
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
              Ajouter un sport de la base
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
                  {selectedSport
                    ? selectedSport.name
                    : "Sélectionnez un sport..."}
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
                        onChangeText={setSearchQuery}
                        placeholder="Rechercher un sport..."
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
                      {getFilteredSports().length > 0 ? (
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
                            Aucun sport trouvé avec ce nom
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
                <TouchableOpacity
                  onPress={() => {
                    setSelectedSport(null);
                    setSearchQuery("");
                    setShowDropdown(false);
                    setShowModal(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 48, // Hauteur minimale
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: colors.foreground,
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.9}
                  >
                    Annuler
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, minWidth: 120 }}>
                {/* Largeur minimale pour éviter la coupure */}
                <ButtonGradient
                  title="Ajouter"
                  onPress={handleAddSelectedSport}
                  size="medium"
                  disabled={!selectedSport}
                />
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </YStack>
  );
};
