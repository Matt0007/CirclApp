# Utilisation du WebSocket Global

Ce document explique comment utiliser le système WebSocket global dans l'application CirclApp.

## Vue d'ensemble

Le WebSocket est maintenant disponible globalement dans toute l'application via un contexte React. Il se connecte automatiquement quand l'utilisateur s'authentifie et se déconnecte quand l'utilisateur se déconnecte.

## Architecture

### 1. WebSocketContext
- **Fichier**: `contexts/WebSocketContext.tsx`
- **Responsabilité**: Gère la connexion WebSocket, la reconnexion automatique et les abonnements aux événements
- **Disponibilité**: Global dans toute l'application

### 2. Hook personnalisé
- **Fichier**: `hooks/useWebSocket.ts`
- **Responsabilité**: Simplifie l'utilisation du WebSocket avec gestion automatique des désabonnements
- **Avantage**: Évite les fuites mémoire en nettoyant automatiquement les abonnements

## Utilisation de base

### Dans un composant React

```tsx
import { useWebSocket } from '../../hooks/useWebSocket';

export default function MonComposant() {
  const { 
    isConnected, 
    sendMessage, 
    subscribeToMessage 
  } = useWebSocket();

  useEffect(() => {
    // S'abonner aux messages
    const unsubscribe = subscribeToMessage((message) => {
      console.log('Message reçu:', message);
    });

    // Nettoyer l'abonnement
    return unsubscribe;
  }, [subscribeToMessage]);

  const handleSendMessage = () => {
    sendMessage({
      type: 'mon_type',
      data: 'Mon message'
    });
  };

  return (
    <View>
      <Text>Status: {isConnected ? 'Connecté' : 'Déconnecté'}</Text>
      <Button onPress={handleSendMessage}>Envoyer</Button>
    </View>
  );
}
```

## Fonctionnalités disponibles

### 1. Gestion des conversations
```tsx
const { 
  joinConversation, 
  leaveConversation, 
  startTyping, 
  stopTyping 
} = useWebSocket();

// Rejoindre une conversation
joinConversation('conv-123');

// Quitter une conversation
leaveConversation('conv-123');

// Indiquer que l'utilisateur tape
startTyping('conv-123');
stopTyping('conv-123');
```

### 2. Écoute des événements
```tsx
const { 
  subscribeToMessage,
  subscribeToTyping,
  subscribeToNewMessage,
  subscribeToConversationUpdate
} = useWebSocket();

// Écouter tous les messages
const unsubscribe = subscribeToMessage((message) => {
  console.log('Message:', message);
});

// Écouter les mises à jour de frappe
const unsubscribeTyping = subscribeToTyping((data) => {
  console.log('Quelqu\'un tape:', data);
});

// Écouter les nouveaux messages
const unsubscribeNewMessage = subscribeToNewMessage((data) => {
  console.log('Nouveau message:', data);
});

// Écouter les mises à jour de conversation
const unsubscribeUpdate = subscribeToConversationUpdate((data) => {
  console.log('Mise à jour conversation:', data);
});
```

### 3. Envoi de messages personnalisés
```tsx
const { sendMessage } = useWebSocket();

// Envoyer un message personnalisé
sendMessage({
  type: 'mon_evenement',
  data: 'Mes données',
  timestamp: new Date().toISOString(),
  userId: 'user-123'
});
```

## Types de messages supportés

### Messages système
- `join_conversation`: Rejoindre une conversation
- `leave_conversation`: Quitter une conversation
- `typing_start`: Commencer à taper
- `typing_stop`: Arrêter de taper

### Messages reçus
- `typing_update`: Mise à jour du statut de frappe
- `new_message`: Nouveau message reçu
- `conversation_update`: Mise à jour d'une conversation

### Messages personnalisés
Vous pouvez envoyer n'importe quel type de message personnalisé en utilisant `sendMessage()`.

## Gestion des erreurs et reconnexion

- **Reconnexion automatique**: Le WebSocket se reconnecte automatiquement en cas de déconnexion
- **Gestion des erreurs**: Les erreurs sont loggées dans la console
- **Nettoyage automatique**: Les abonnements sont nettoyés automatiquement lors du démontage des composants

## Bonnes pratiques

### 1. Toujours nettoyer les abonnements
```tsx
useEffect(() => {
  const unsubscribe = subscribeToMessage(callback);
  return unsubscribe; // Important !
}, [subscribeToMessage]);
```

### 2. Vérifier la connexion avant d'envoyer
```tsx
const { isConnected, sendMessage } = useWebSocket();

const handleSend = () => {
  if (isConnected) {
    sendMessage(data);
  } else {
    console.warn('WebSocket non connecté');
  }
};
```

### 3. Utiliser le hook personnalisé
Préférez `useWebSocket()` du dossier `hooks/` plutôt que d'utiliser directement le contexte, car il gère automatiquement le nettoyage.

## Exemples d'utilisation

### Page des conversations
Voir `app/(backPage)/conversations.tsx` pour un exemple complet d'utilisation des conversations.

### Page sociale
Voir `app/(tabs)/social.tsx` pour un exemple d'utilisation personnalisée du WebSocket.

## Configuration

Le WebSocket se connecte automatiquement à l'URL définie dans `config/api.ts` en remplaçant `http` par `ws` et en ajoutant le token d'authentification.

## Dépannage

### WebSocket non connecté
1. Vérifiez que l'utilisateur est authentifié
2. Vérifiez la configuration de l'API dans `config/api.ts`
3. Vérifiez que le serveur WebSocket fonctionne

### Messages non reçus
1. Vérifiez que vous êtes bien abonné aux bons événements
2. Vérifiez les logs de la console pour les erreurs
3. Vérifiez que le type de message correspond à ce que vous écoutez

### Fuites mémoire
1. Assurez-vous de toujours retourner la fonction de désabonnement dans `useEffect`
2. Utilisez le hook `useWebSocket()` qui gère automatiquement le nettoyage
