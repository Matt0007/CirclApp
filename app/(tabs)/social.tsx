import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Text, XStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import { MapView } from "../../components/common";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";

export default function Social() {
  const { colors } = useTheme();

  const { t } = useLocalization();
  const insets = useSafeAreaInsets();

  const [userLocation, setUserLocation] = useState<[number, number]>([
    2.3522, 48.8566,
  ]); // Paris par défaut
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // Demander les permissions de localisation
  useEffect(() => {
    requestLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setHasLocationPermission(true);
        getCurrentLocation();
      } else {
        Alert.alert(
          "Permission refusée",
          "Nous avons besoin de votre localisation pour afficher les événements près de chez vous."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation([location.coords.longitude, location.coords.latitude]);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la localisation:",
        error
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      {/* Header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$3"
        backgroundColor={colors.background}
        borderBottomWidth={1}
        borderBottomColor={colors.border}
      >
        <Text color={colors.foreground} fontSize="$6" fontWeight="700">
          {t("social")}
        </Text>

        <XStack space="$3" alignItems="center">
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Alert.alert("Filtres", "Filtres à venir")}
          >
            <Ionicons
              name="filter-outline"
              size={24}
              color={colors.foreground}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Alert.alert("Recherche", "Recherche à venir")}
          >
            <Ionicons
              name="search-outline"
              size={24}
              color={colors.foreground}
            />
          </TouchableOpacity>
        </XStack>
      </XStack>

      {/* Carte */}
      <View style={styles.mapContainer}>
        <MapView
          centerCoordinate={userLocation}
          zoomLevel={14}
          showUserLocation={hasLocationPermission}
          style={styles.map}
        />
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  infoPanel: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconButton: {
    padding: 8,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  eventItem: {
    padding: 12,
    borderRadius: 8,
  },
});
