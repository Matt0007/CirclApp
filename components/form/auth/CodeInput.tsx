import React, { useRef, useState } from "react";
import { TextInput, View, TouchableOpacity, Text } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";

interface CodeInputProps {
  length: number;
  value: string;
  onChangeText: (text: string) => void;
  onComplete?: (code: string) => void;
  onBlur?: () => void;
}

export default function CodeInput({
  length,
  value,
  onChangeText,
  onComplete,
  onBlur,
}: CodeInputProps) {
  const { colors } = useTheme();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const hiddenInputRef = useRef<TextInput>(null);

  const handleCodeChange = (text: string) => {
    // Vérifier que c'est bien un chiffre
    if (text && !/^\d+$/.test(text)) {
      return; // Ignorer si ce n'est pas un chiffre
    }

    // Si on modifie le code après une soumission, réinitialiser le flag
    if (hasSubmitted) {
      setHasSubmitted(false);
    }

    onChangeText(text);

    // Si le code est complet et qu'il n'a pas encore été soumis, déclencher onComplete
    if (text.length === length && onComplete && !hasSubmitted) {
      setHasSubmitted(true);
      onComplete(text);
    }
  };

  const handleCodeDigitPress = () => {
    // Afficher le clavier et focaliser l'input caché
    hiddenInputRef.current?.focus();
  };

  const renderCodeDigit = (index: number) => {
    const digit = value[index] || "";
    const isFocused = value.length === index;

    return (
      <TouchableOpacity
        key={index}
        style={[
          {
            width: 45,
            height: 45,
            borderRadius: 10,
            backgroundColor: colors.input,
            borderWidth: 1,
            borderColor: colors.border,
            justifyContent: "center",
            alignItems: "center",

            elevation: 3,
          },
          isFocused && {
            borderWidth: 3,
            borderColor: colors.primary,
            elevation: 5,
          },
          digit && {
            backgroundColor: colors.primary,
            borderColor: colors.border,
          },
        ]}
        onPress={handleCodeDigitPress}
        activeOpacity={0.7}
      >
        <Text
          style={[
            {
              fontSize: 20,
              fontWeight: "bold",
              color: colors.mutedForeground,
            },
            digit && {
              color: "#FFFFFF",
            },
          ]}
        >
          {digit}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          marginTop: 8,
        }}
      >
        {Array.from({ length }).map((_, index) => renderCodeDigit(index))}
      </View>

      {/* Input caché pour la saisie */}
      <TextInput
        style={{
          position: "absolute",
          opacity: 0,
          width: 1,
          height: 1,
        }}
        value={value}
        onChangeText={handleCodeChange}
        onBlur={onBlur}
        placeholder=""
        keyboardType="numeric"
        maxLength={length}
        autoFocus={true}
        caretHidden={true}
        ref={hiddenInputRef}
      />
    </View>
  );
}
