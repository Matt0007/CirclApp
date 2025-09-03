import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useTheme } from "../../contexts/ThemeContext";
import { MAPBOX_ACCESS_TOKEN } from "../../config/mapbox";
import * as Location from "expo-location";

interface MapViewProps {
  style?: any;
  centerCoordinate?: [number, number];
  zoomLevel?: number;
  showUserLocation?: boolean;
  onMapPress?: (event: any) => void;
  mapStyle?: string;
}

export default function MapView({
  style,
  centerCoordinate = [2.3522, 48.8566], // Paris par défaut
  zoomLevel = 12,
  showUserLocation = true,
  onMapPress,
  mapStyle = "mapbox://styles/mapbox/streets-v12",
}: MapViewProps) {
  const { colors } = useTheme();
  const webViewRef = useRef<WebView>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  // Obtenir la localisation de l'utilisateur avec expo-location
  useEffect(() => {
    if (showUserLocation) {
      getCurrentLocation();
    }
  }, [showUserLocation]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const newLocation: [number, number] = [
          location.coords.longitude,
          location.coords.latitude,
        ];
        setUserLocation(newLocation);

        // Envoyer la position à la WebView
        if (webViewRef.current) {
          webViewRef.current.postMessage(
            JSON.stringify({
              type: "setUserLocation",
              coordinates: newLocation,
            })
          );
        }
      }
    } catch (error) {
      console.error("Erreur de géolocalisation:", error);
    }
  };

  // HTML pour la carte Mapbox
  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mapbox Map</title>
      <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
      <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
      <style>
        body { margin: 0; padding: 0; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; }
        .mapboxgl-marker {
          background-color: ${colors.primary};
          width: 12px;
          height: 12px;
          border-radius: 6px;
          border: 2px solid white;
          cursor: pointer;
        }
        
        /* Masquer complètement TOUTES les icônes de localisation par défaut */
        .mapboxgl-user-location-dot,
        .mapboxgl-user-location-dot-heading,
        .mapboxgl-user-location-accuracy-circle,
        .mapboxgl-user-location {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        
        /* Style pour notre icône personnalisée */
        .custom-user-location {
          width: 20px;
          height: 20px;
          background-color: ${colors.primary};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 2px ${colors.primary}40;
          position: relative;
        }
        
        .custom-user-location::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        mapboxgl.accessToken = '${MAPBOX_ACCESS_TOKEN}';
        
        const map = new mapboxgl.Map({
          container: 'map',
          style: '${mapStyle}',
          center: [${centerCoordinate[0]}, ${centerCoordinate[1]}],
          zoom: ${zoomLevel}
        });

        // Variables globales
        let userLocationMarker = null;
        let customUserLocationIcon = null;

        // Créer une icône personnalisée pour la localisation utilisateur
        function createUserLocationIcon() {
          const icon = document.createElement('div');
          icon.className = 'custom-user-location';
          return icon;
        }

        // Fonction pour ajouter le marqueur de localisation utilisateur
        function addUserLocationMarker(coordinates) {
          if (userLocationMarker) {
            userLocationMarker.remove();
          }
          
          customUserLocationIcon = createUserLocationIcon();
          userLocationMarker = new mapboxgl.Marker(customUserLocationIcon)
            .setLngLat(coordinates)
            .addTo(map);
          
          // Centrer la carte sur la position utilisateur
          map.flyTo({
            center: coordinates,
            zoom: 14,
            duration: 2000
          });
        }



        // Gérer les clics sur la carte
        map.on('click', (e) => {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapClick',
            coordinates: [e.lngLat.lng, e.lngLat.lat]
          }));
        });

        // Gérer les erreurs
        map.on('error', (e) => {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapError',
            error: e.error.message
          }));
        });

        // Notifier que la carte est prête
        map.on('load', () => {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapLoaded'
          }));
        });

        // Écouter les messages de React Native
        window.addEventListener('message', function(event) {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'setUserLocation') {
              addUserLocationMarker(data.coordinates);
            }
          } catch (error) {
            console.error('Erreur lors du parsing du message:', error);
          }
        });
      </script>
    </body>
    </html>
  `;

  // Gérer les messages de la WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "mapClick" && onMapPress) {
        onMapPress(data.coordinates);
      } else if (data.type === "mapError") {
        console.error("Erreur Mapbox:", data.error);
      } else if (data.type === "mapLoaded") {
        console.log("Carte Mapbox chargée avec succès");
        // Si on a déjà la localisation, l'envoyer à la WebView
        if (userLocation) {
          webViewRef.current?.postMessage(
            JSON.stringify({
              type: "setUserLocation",
              coordinates: userLocation,
            })
          );
        }
      }
    } catch (error) {
      console.error("Erreur lors du parsing du message:", error);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ html: mapHTML }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        bounces={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
