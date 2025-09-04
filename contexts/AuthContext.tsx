import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserSport } from "../types";
import { API_BASE_URL } from "../config/api";
import { getSecureImageUrl } from "../config/imageToken";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  secureImageUrl: string | null;
  login: (userData: {
    id: string;
    email: string;
    token: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUserSports: (newSports: UserSport[]) => void;
  updateProfileImage: (newImageUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [secureImageUrl, setSecureImageUrl] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Générer l'URL sécurisée pour l'image de profil
  const generateSecureImageUrl = async (
    imageUrl: string | null
  ): Promise<string | null> => {
    if (!imageUrl) return null;

    // Utiliser la fonction centralisée getSecureImageUrl
    return getSecureImageUrl(imageUrl);
  };

  // Mettre à jour secureImageUrl quand user.profileImage change
  useEffect(() => {
    const updateSecureImageUrl = async () => {
      if (user?.profileImage) {
        const secureUrl = await generateSecureImageUrl(user.profileImage);
        setSecureImageUrl(secureUrl);
      } else {
        setSecureImageUrl(null);
      }
    };

    updateSecureImageUrl();
  }, [user?.profileImage]);

  // Fonction pour récupérer les données utilisateur depuis l'API
  const fetchUserData = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données utilisateur"
        );
      }

      const data = await response.json();
      if (data.status === "success") {
        return data.user;
      }
      return null;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
      return null;
    }
  };

  const login = async (userData: {
    id: string;
    email: string;
    token: string;
  }) => {
    try {
      // Stocker seulement le token et l'ID
      await AsyncStorage.setItem("token", userData.token);
      await AsyncStorage.setItem("userId", userData.id);

      // Récupérer les données complètes depuis l'API
      const fullUserData = await fetchUserData(userData.token);
      if (fullUserData) {
        setUser(fullUserData);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (token && userId) {
        // Récupérer les données fraîches depuis l'API
        const userData = await fetchUserData(token);
        if (userData) {
          setUser(userData);
        } else {
          // Token invalide, déconnecter l'utilisateur
          await logout();
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du statut d'authentification:",
        error
      );
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const userData = await fetchUserData(token);
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données:", error);
    }
  };

  const updateUserSports = (newSports: UserSport[]) => {
    setUser((prev) => (prev ? { ...prev, userSports: newSports } : null));
  };

  const updateProfileImage = (newImageUrl: string) => {
    setUser((prev) => (prev ? { ...prev, profileImage: newImageUrl } : null));
  };

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    secureImageUrl,
    login,
    logout,
    checkAuthStatus,
    refreshUserData,
    updateUserSports,
    updateProfileImage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
