import { useState, useEffect } from "react";
import { getSecureImageUrl } from "../config/imageToken";

export const useSecureImage = (imageUrl: string | null) => {
  const [secureImageUrl, setSecureImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSecureImage = async () => {
      if (!imageUrl) {
        setSecureImageUrl(null);
        return;
      }

      setIsLoading(true);
      try {
        const secureUrl = getSecureImageUrl(imageUrl);
        setSecureImageUrl(secureUrl);
      } catch (error) {
        console.error("Erreur lors du chargement de l'image sécurisée:", error);
        setSecureImageUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSecureImage();
  }, [imageUrl]);

  return {
    secureImageUrl,
    isLoading,
  };
};
