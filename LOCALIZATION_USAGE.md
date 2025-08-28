# Guide d'utilisation de la localisation

Ce guide explique comment utiliser le système de localisation dans l'application Circl.

## Vue d'ensemble

L'application supporte actuellement deux langues :
- **Français (fr)** - Langue par défaut
- **Anglais (en)** - Langue secondaire

## Structure des fichiers

```
locales/
├── index.ts          # Export principal et types
├── fr.ts            # Traductions françaises
└── en.ts            # Traductions anglaises
```

## Utilisation dans les composants

### 1. Importer le hook de localisation

```tsx
import { useLocalization } from '../../contexts/LocalizationContext';
```

### 2. Utiliser le hook dans le composant

```tsx
const { t, locale, changeLocale } = useLocalization();

// Traduire un texte
<Text>{t('home')}</Text>

// Obtenir la langue actuelle
console.log('Langue actuelle:', locale);

// Changer de langue
changeLocale('en');
```

### 3. Exemple complet

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalization } from '../../contexts/LocalizationContext';

const MyComponent = () => {
  const { t, locale, changeLocale } = useLocalization();

  return (
    <View>
      <Text>{t('welcome')}</Text>
      <Text>Langue actuelle: {locale}</Text>
      
      <TouchableOpacity onPress={() => changeLocale('fr')}>
        <Text>Français</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => changeLocale('en')}>
        <Text>English</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## Ajouter de nouvelles traductions

### 1. Ajouter la clé dans les fichiers de traduction

**fr.ts:**
```tsx
export default {
  // ... autres traductions
  newKey: 'Nouvelle traduction',
};
```

**en.ts:**
```tsx
export default {
  // ... autres traductions
  newKey: 'New translation',
};
```

### 2. Utiliser dans les composants

```tsx
<Text>{t('newKey')}</Text>
```

## Clés de traduction disponibles

### Navigation
- `home` - Accueil/Home
- `profile` - Profil/Profile
- `social` - Social
- `sport` - Sport
- `settings` - Paramètres/Settings

### Authentification
- `login` - Connexion/Login
- `register` - Inscription/Register
- `email` - Email
- `password` - Mot de passe/Password

### Profil
- `completeProfile` - Compléter le profil/Complete Profile
- `firstName` - Prénom/First Name
- `lastName` - Nom/Last Name
- `dateOfBirth` - Date de naissance/Date of Birth

### Sports
- `football` - Football
- `basketball` - Basketball
- `tennis` - Tennis
- Et bien d'autres...

### Commun
- `save` - Sauvegarder/Save
- `cancel` - Annuler/Cancel
- `loading` - Chargement/Loading
- `error` - Erreur/Error

## Gestion automatique de la langue

L'application détecte automatiquement la langue du dispositif et l'utilise par défaut si elle est supportée (français ou anglais). Sinon, elle utilise l'anglais par défaut.

## Persistance

La langue sélectionnée est sauvegardée dans le stockage local et restaurée au redémarrage de l'application.

## Support RTL

Actuellement, seules les langues LTR (Left-to-Right) sont supportées (français et anglais). Le support RTL peut être ajouté ultérieurement si nécessaire.

## Bonnes pratiques

1. **Toujours utiliser le hook `useLocalization`** au lieu de texte en dur
2. **Utiliser des clés descriptives** pour les traductions
3. **Grouper les traductions par fonctionnalité** dans les fichiers de traduction
4. **Tester les deux langues** lors du développement
5. **Éviter les concaténations de chaînes** - utiliser des clés de traduction complètes

## Dépannage

### Erreur "useLocalization must be used within a LocalizationProvider"

Assurez-vous que votre composant est enveloppé dans le `LocalizationProvider` dans le layout principal.

### Traduction manquante

Vérifiez que la clé existe dans les deux fichiers de traduction (fr.ts et en.ts).

### Langue qui ne change pas

Vérifiez que vous appelez bien `changeLocale()` et non `setLocale()` directement.
