import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSecureImage = (imageUrl: string | null) => {
  const [secureImageUrl, setSecureImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSecureImage = async () => {
      if (!imageUrl) {
        setSecureImageUrl(null);
        return;
      }

      // Si c'est déjà une URL de notre API privée, l'utiliser directement
      if (imageUrl && imageUrl.includes("/images/profile/")) {
        setIsLoading(true);
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            setSecureImageUrl(null);
            return;
          }

          // Créer une URL avec le token d'authentification
          const url = new URL(imageUrl);
          url.searchParams.set("token", token);
          setSecureImageUrl(url.toString());
        } catch (error) {
          console.error(
            "Erreur lors du chargement de l'image sécurisée:",
            error
          );
          setSecureImageUrl(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        // URL publique, l'utiliser directement
        setSecureImageUrl(imageUrl);
      }
    };

    loadSecureImage();
  }, [imageUrl]);

  return {
    secureImageUrl,
    isLoading,
  };
};
