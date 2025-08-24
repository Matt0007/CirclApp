# Circl App

Application mobile de gestion de projets avec système d'authentification et thèmes dynamiques.

## Fonctionnalités

### 🔐 Système d'Authentification
- **Connexion/Inscription** : Interface moderne avec validation des champs
- **Protection des routes** : Redirection automatique vers l'authentification si non connecté
- **Persistance** : Stockage local des informations de connexion
- **Gestion des états** : Loading, erreurs, et déconnexion

### 🎨 Système de Thèmes
- **Thèmes clair et sombre** : Adaptation automatique au système
- **Couleurs OKLCH** : Palette de couleurs moderne et accessible
- **Toggle manuel** : Possibilité de changer de thème manuellement
- **Context global** : Accès aux couleurs depuis n'importe où dans l'app

## Structure du Projet

```
CirclApp/
├── app/
│   ├── (auth)/
│   │   └── auth.tsx          # Page d'authentification
│   ├── _layout.tsx           # Layout principal avec contextes
│   └── index.tsx             # Page d'accueil protégée
├── components/
│   ├── ProtectedRoute.tsx    # Composant de protection des routes
│   └── ThemeToggle.tsx       # Toggle de thème
├── contexts/
│   ├── AuthContext.tsx       # Contexte d'authentification
│   └── ThemeContext.tsx      # Contexte de thème
├── types/
│   └── index.ts              # Types TypeScript centralisés
└── utils/
    └── colors.ts             # Définition des couleurs OKLCH
```

## Utilisation

### Authentification
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Text>Veuillez vous connecter</Text>;
  }
  
  return <Text>Bienvenue {user?.name}!</Text>;
}
```

### Thème
```typescript
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { colors, colorScheme, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.foreground }}>
        Thème actuel : {colorScheme}
      </Text>
      <TouchableOpacity onPress={toggleTheme}>
        <Text>Changer de thème</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Protection des Routes
```typescript
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <Text>Contenu protégé</Text>
    </ProtectedRoute>
  );
}
```

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer l'application :
```bash
npm start
```

## Dépendances Principales

- `@react-native-async-storage/async-storage` : Stockage local
- `expo-router` : Navigation
- `react-native-safe-area-context` : Gestion des zones sûres
- `tamagui` : Composants UI

## Personnalisation

### Ajouter de nouvelles couleurs
Modifiez le fichier `utils/colors.ts` pour ajouter de nouvelles couleurs au thème.

### Modifier l'interface d'authentification
Personnalisez le composant `app/(auth)/auth.tsx` selon vos besoins.

### Ajouter de nouvelles routes protégées
Utilisez le composant `ProtectedRoute` autour de vos nouvelles pages.

## Notes Techniques

- Les couleurs utilisent le format OKLCH pour une meilleure accessibilité
- L'authentification est simulée (remplacez par vos appels API)
- Le thème s'adapte automatiquement au système d'exploitation
- Tous les composants sont typés avec TypeScript
# CirclApp
