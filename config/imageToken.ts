import Constants from "expo-constants";
export const IMAGE_SECRET_TOKEN = Constants.expoConfig?.extra?.imageSecretToken;

// Fonction pour obtenir l'URL sécurisée d'une image
export const getSecureImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;

  try {
    // Si c'est une URL de notre API, convertir en URL publique avec token
    if (
      imageUrl.includes("/images/profile/") ||
      imageUrl.includes("/images/public/")
    ) {
      let publicUrl = imageUrl;
      if (imageUrl.includes("/images/profile/")) {
        publicUrl = imageUrl.replace("/images/profile/", "/images/public/");
      }

      const url = new URL(publicUrl);
      url.searchParams.set("token", IMAGE_SECRET_TOKEN);
      return url.toString();
    }

    // URL externe, retourner telle quelle
    return imageUrl;
  } catch {
    return imageUrl;
  }
};
