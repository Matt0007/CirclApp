import { useState } from "react";
import { API_BASE_URL } from "../../config/api";

interface SendVerificationRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

interface SendVerificationResponse {
  status: string;
  message: string;
}

export const useSendVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendVerification = async (
    request: SendVerificationRequest
  ): Promise<SendVerificationResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data: SendVerificationResponse = await response.json();

      if (data.status === "error") {
        throw new Error(data.message);
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de l'envoi du code";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendVerification,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
