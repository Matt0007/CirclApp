import { useState } from "react";
import { API_BASE_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FollowResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface FollowStatusResponse {
  success: boolean;
  data: {
    isFollowing: boolean;
  };
}

export const useFollow = () => {
  const [isLoading, setIsLoading] = useState(false);

  const followUser = async (userId: string): Promise<FollowResponse> => {
    setIsLoading(true);
    try {
      // Récupérer le token depuis AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        return {
          success: false,
          message: "Token d'authentification requis",
        };
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Erreur lors du suivi de l'utilisateur",
        };
      }

      return data;
    } catch (error) {
      console.error("Erreur lors du suivi:", error);
      return {
        success: false,
        message: "Erreur lors du suivi de l'utilisateur",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const unfollowUser = async (userId: string): Promise<FollowResponse> => {
    setIsLoading(true);
    try {
      // Récupérer le token depuis AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        return {
          success: false,
          message: "Token d'authentification requis",
        };
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message || "Erreur lors de l'arrêt du suivi de l'utilisateur",
        };
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de l'arrêt du suivi:", error);
      return {
        success: false,
        message: "Erreur lors de l'arrêt du suivi de l'utilisateur",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkFollowStatus = async (
    userId: string
  ): Promise<FollowStatusResponse | null> => {
    try {
      // Récupérer le token depuis AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("Token d'authentification requis");
        return null;
      }

      const response = await fetch(
        `${API_BASE_URL}/users/${userId}/follow-status`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Erreur lors de la vérification du statut de suivi:",
          data.message
        );
        return null;
      }

      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du statut de suivi:",
        error
      );
      return null;
    }
  };

  const getFollowers = async (
    userId: string,
    page: number = 1,
    limit: number = 20
  ) => {
    try {
      // Récupérer le token depuis AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("Token d'authentification requis");
        return null;
      }

      const response = await fetch(
        `${API_BASE_URL}/users/${userId}/followers?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des followers:", error);
      return null;
    }
  };

  const getFollowing = async (
    userId: string,
    page: number = 1,
    limit: number = 20
  ) => {
    try {
      // Récupérer le token depuis AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("Token d'authentification requis");
        return null;
      }

      const response = await fetch(
        `${API_BASE_URL}/users/${userId}/following?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des following:", error);
      return null;
    }
  };

  const removeFollower = async (
    userId: string,
    followerToRemoveId: string
  ): Promise<FollowResponse> => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          message: "Token d'authentification manquant",
        };
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/follower`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ followerToRemoveId }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la suppression du follower:", error);
      return {
        success: false,
        message: "Erreur lors de la suppression du follower",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    followUser,
    unfollowUser,
    checkFollowStatus,
    getFollowers,
    getFollowing,
    removeFollower,
    isLoading,
  };
};
