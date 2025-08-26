import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../config/api";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  onMessage: (callback: (message: WebSocketMessage) => void) => (() => void);
  onTypingUpdate: (callback: (data: { conversationId: string; userId: string; isTyping: boolean }) => void) => (() => void);
  onNewMessage: (callback: (data: { conversationId: string; message: any }) => void) => (() => void);
  onConversationUpdate: (callback: (data: { conversationId: string; updateType: string; data: any }) => void) => (() => void);
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageCallbacks = useRef<((message: WebSocketMessage) => void)[]>([]);
  const typingCallbacks = useRef<((data: { conversationId: string; userId: string; isTyping: boolean }) => void)[]>([]);
  const newMessageCallbacks = useRef<((data: { conversationId: string; message: any }) => void)[]>([]);
  const conversationUpdateCallbacks = useRef<((data: { conversationId: string; updateType: string; data: any }) => void)[]>([]);

  // Fonction pour se connecter au WebSocket
  const connect = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      // Récupérer le token depuis AsyncStorage
      const AsyncStorage = await import("@react-native-async-storage/async-storage");
      const token = await AsyncStorage.default.getItem("token");
      
      if (!token) return;

      // Créer l'URL WebSocket avec le token
      const wsUrl = API_BASE_URL.replace('http', 'ws') + `?token=${token}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connecté");
        setIsConnected(true);
        
        // Annuler le timeout de reconnexion
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log("Message WebSocket reçu:", message);
          
          // Appeler tous les callbacks de message
          messageCallbacks.current.forEach(callback => callback(message));
          
          // Traiter les messages spécifiques
          switch (message.type) {
            case 'typing_update':
              typingCallbacks.current.forEach(callback => 
                callback({
                  conversationId: message.conversationId,
                  userId: message.userId,
                  isTyping: message.isTyping
                })
              );
              break;
              
            case 'new_message':
              newMessageCallbacks.current.forEach(callback => 
                callback({
                  conversationId: message.conversationId,
                  message: message.message
                })
              );
              break;
              
            case 'conversation_update':
              conversationUpdateCallbacks.current.forEach(callback => 
                callback({
                  conversationId: message.conversationId,
                  updateType: message.updateType,
                  data: message.data
                })
              );
              break;
          }
        } catch (error) {
          console.error("Erreur lors du parsing du message WebSocket:", error);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket déconnecté:", event.code, event.reason);
        setIsConnected(false);
        
        // Tentative de reconnexion automatique
        if (event.code !== 1000) { // Pas une fermeture normale
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Tentative de reconnexion WebSocket...");
            connect();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error("Erreur WebSocket:", error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error("Erreur lors de la connexion WebSocket:", error);
    }
  }, [isAuthenticated, user]);

  // Fonction pour envoyer un message
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket non connecté, impossible d'envoyer le message");
    }
  }, []);

  // Fonctions utilitaires pour les conversations
  const joinConversation = useCallback((conversationId: string) => {
    sendMessage({
      type: 'join_conversation',
      conversationId
    });
  }, [sendMessage]);

  const leaveConversation = useCallback((conversationId: string) => {
    sendMessage({
      type: 'leave_conversation',
      conversationId
    });
  }, [sendMessage]);

  const startTyping = useCallback((conversationId: string) => {
    sendMessage({
      type: 'typing_start',
      conversationId
    });
  }, [sendMessage]);

  const stopTyping = useCallback((conversationId: string) => {
    sendMessage({
      type: 'typing_stop',
      conversationId
    });
  }, [sendMessage]);

  // Fonctions pour s'abonner aux événements
  const onMessage = useCallback((callback: (message: WebSocketMessage) => void) => {
    messageCallbacks.current.push(callback);
    
    // Retourner une fonction pour se désabonner
    return () => {
      const index = messageCallbacks.current.indexOf(callback);
      if (index > -1) {
        messageCallbacks.current.splice(index, 1);
      }
    };
  }, []);

  const onTypingUpdate = useCallback((callback: (data: { conversationId: string; userId: string; isTyping: boolean }) => void) => {
    typingCallbacks.current.push(callback);
    
    return () => {
      const index = typingCallbacks.current.indexOf(callback);
      if (index > -1) {
        typingCallbacks.current.splice(index, 1);
      }
    };
  }, []);

  const onNewMessage = useCallback((callback: (data: { conversationId: string; message: any }) => void) => {
    newMessageCallbacks.current.push(callback);
    
    return () => {
      const index = newMessageCallbacks.current.indexOf(callback);
      if (index > -1) {
        newMessageCallbacks.current.splice(index, 1);
      }
    };
  }, []);

  const onConversationUpdate = useCallback((callback: (data: { conversationId: string; updateType: string; data: any }) => void) => {
    conversationUpdateCallbacks.current.push(callback);
    
    return () => {
      const index = conversationUpdateCallbacks.current.indexOf(callback);
      if (index > -1) {
        conversationUpdateCallbacks.current.splice(index, 1);
      }
    };
  }, []);

  // Se connecter quand l'utilisateur s'authentifie
  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    } else {
      // Déconnecter le WebSocket si l'utilisateur n'est pas authentifié
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    }
  }, [isAuthenticated, user, connect]);

  // Nettoyer à la déconnexion
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const value: WebSocketContextType = {
    isConnected,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    onMessage,
    onTypingUpdate,
    onNewMessage,
    onConversationUpdate,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
