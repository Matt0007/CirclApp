export const IMAGE_SECRET_TOKEN =
  "9a3c8e1f9f6d2b4a7c5e0d1a8f2b9c6d7e4a0f1b3d8c6e9f7a2d4c0b5e7f3a9";

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
