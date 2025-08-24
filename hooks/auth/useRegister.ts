import { useState } from "react";
import { API_BASE_URL } from "../../config/api";

interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  code: string;
  confirmPassword: string;
}

interface RegisterResponse {
  status: string;
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  };
  token: string;
}

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    credentials: RegisterCredentials
  ): Promise<RegisterResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data: RegisterResponse = await response.json();

      if (data.status === "error") {
        throw new Error(data.message);
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur d'inscription";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
