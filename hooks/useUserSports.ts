import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Sport {
  id: string;
  name: string;
  isActive: boolean;
}

export const useUserSports = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUserSports = useCallback(async () => {
    if (!user?.id) {
      console.log("❌ Pas d'utilisateur:", { userId: user?.id });
      setLoading(false);
      return;
    }

    // Récupérer le token depuis AsyncStorage
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.log("❌ Pas de token dans AsyncStorage");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Récupération des sports pour l'utilisateur:", user.id);
      console.log("🔗 URL:", `${API_BASE_URL}/users/${user.id}/sports`);

      const response = await fetch(`${API_BASE_URL}/users/${user.id}/sports`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Status de la réponse:", response.status);
      console.log(
        "📡 Headers de la réponse:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erreur de réponse:", errorText);
        throw new Error(
          `Erreur lors de la récupération des sports: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("✅ Données reçues:", data);
      setSports(data);
    } catch (err) {
      console.error("❌ Erreur lors de la récupération des sports:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserSports();
  }, [fetchUserSports]);

  return {
    sports,
    loading,
    error,
    refetch: fetchUserSports,
  };
};
