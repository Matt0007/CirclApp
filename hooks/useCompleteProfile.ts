import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useImageUpload } from "./useImageUpload";

interface ProfileData {
  gender: string;
  birthDate: Date | null;
  city: string;
  selectedSports: string[];
  profileImage: string | null;
}

interface UseCompleteProfileReturn {
  isSubmitting: boolean;
  completeProfile: (profileData: ProfileData) => Promise<boolean>;
}

export const useCompleteProfile = (): UseCompleteProfileReturn => {
  const { user } = useAuth();
  const { uploadImage } = useImageUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeProfile = async (
    profileData: ProfileData
  ): Promise<boolean> => {
    if (!user?.id) {
      Alert.alert("Erreur", "Utilisateur non connecté");
      return false;
    }

    setIsSubmitting(true);

    try {
      // Upload de l'image si elle existe
      let finalImageUrl = null;
      if (
        profileData.profileImage &&
        profileData.profileImage.startsWith("file://")
      ) {
        try {
          finalImageUrl = await uploadImage(profileData.profileImage);
        } catch (error) {
          console.error("Erreur lors de l'upload de l'image:", error);
          Alert.alert(
            "Attention",
            "L'image n'a pas pu être uploadée, mais le profil sera créé sans image."
          );
        }
      } else if (profileData.profileImage) {
        // Si c'est déjà une URL (déjà uploadée)
        finalImageUrl = profileData.profileImage;
      }

      // Préparer les données du profil
      const apiProfileData = {
        gender:
          profileData.gender === "Homme"
            ? "HOMME"
            : profileData.gender === "Femme"
            ? "FEMME"
            : "AUTRE",
        birthDate: profileData.birthDate?.toISOString(),
        city: profileData.city,
        selectedSports: profileData.selectedSports,
        profileImage: finalImageUrl,
      };

      // Récupérer le token depuis AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token d'authentification requis");
      }

      // Appeler l'API pour finaliser le profil
      const response = await fetch(`${API_BASE_URL}/profile/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          profileData: apiProfileData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la finalisation du profil"
        );
      }

      const result = await response.json();
      console.log("Profil finalisé avec succès:", result);
      return true;
    } catch (error) {
      console.error("Erreur lors de la finalisation du profil:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la finalisation du profil. Veuillez réessayer.";
      Alert.alert("Erreur", errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    completeProfile,
  };
};
