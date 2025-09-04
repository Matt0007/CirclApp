import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UploadResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const pickImage = async (): Promise<string | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la sélection d'image:", error);
      return null;
    }
  };

  const uploadImage = async (imageUri: string): Promise<string | null> => {
    if (!user?.id) {
      throw new Error("Utilisateur non connecté");
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Récupérer le token
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token d'authentification requis");
      }

      // 1. Obtenir l'URL d'upload signée
      const fileName = `profile-${Date.now()}.jpg`;
      const contentType = "image/jpeg";

      const urlResponse = await fetch(`${API_BASE_URL}/upload/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName,
          contentType,
          userId: user.id,
        }),
      });

      if (!urlResponse.ok) {
        throw new Error("Erreur lors de la génération de l'URL d'upload");
      }

      const uploadData: UploadResponse = await urlResponse.json();

      // 2. Upload direct vers Cloudflare R2
      const formData = new FormData();
      const imageFile = {
        uri: imageUri,
        type: contentType,
        name: fileName,
      } as any;

      formData.append("file", imageFile);

      const uploadResponse = await fetch(uploadData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: await fetch(imageUri).then((res) => res.blob()),
      });

      if (!uploadResponse.ok) {
        throw new Error("Erreur lors de l'upload de l'image");
      }

      setUploadProgress(100);

      // 3. Confirmer l'upload
      const confirmResponse = await fetch(`${API_BASE_URL}/upload/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          imageKey: uploadData.key,
          imageUrl: uploadData.publicUrl,
        }),
      });

      if (!confirmResponse.ok) {
        throw new Error("Erreur lors de la confirmation de l'upload");
      }

      // Retourner le chemin relatif (sera stocké en base de données)
      return uploadData.publicUrl;
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    try {
      const imageUri = await pickImage();
      if (!imageUri) {
        return null;
      }

      return await uploadImage(imageUri);
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image de profil:", error);
      throw error;
    }
  };

  return {
    uploadProfileImage,
    uploadImage,
    isUploading,
    uploadProgress,
  };
};
