import { useEffect, useRef } from 'react';
import { useWebSocket as useWebSocketContext } from '../contexts/WebSocketContext';

// Hook personnalisé pour gérer les abonnements WebSocket
export const useWebSocket = () => {
  const webSocket = useWebSocketContext();
  const unsubscribeRefs = useRef<(() => void)[]>([]);

  // Fonction pour s'abonner à un type de message spécifique
  const subscribeToMessage = (callback: (message: any) => void) => {
    const unsubscribe = webSocket.onMessage(callback);
    unsubscribeRefs.current.push(unsubscribe);
    return unsubscribe;
  };

  // Fonction pour s'abonner aux mises à jour de frappe
  const subscribeToTyping = (callback: (data: { conversationId: string; userId: string; isTyping: boolean }) => void) => {
    const unsubscribe = webSocket.onTypingUpdate(callback);
    unsubscribeRefs.current.push(unsubscribe);
    return unsubscribe;
  };

  // Fonction pour s'abonner aux nouveaux messages
  const subscribeToNewMessage = (callback: (data: { conversationId: string; message: any }) => void) => {
    const unsubscribe = webSocket.onNewMessage(callback);
    unsubscribeRefs.current.push(unsubscribe);
    return unsubscribe;
  };

  // Fonction pour s'abonner aux mises à jour de conversation
  const subscribeToConversationUpdate = (callback: (data: { conversationId: string; updateType: string; data: any }) => void) => {
    const unsubscribe = webSocket.onConversationUpdate(callback);
    unsubscribeRefs.current.push(unsubscribe);
    return unsubscribe;
  };

  // Nettoyer tous les abonnements lors du démontage du composant
  useEffect(() => {
    return () => {
      unsubscribeRefs.current.forEach(unsubscribe => unsubscribe());
      unsubscribeRefs.current = [];
    };
  }, []);

  return {
    ...webSocket,
    subscribeToMessage,
    subscribeToTyping,
    subscribeToNewMessage,
    subscribeToConversationUpdate,
  };
};
