import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Text } from "tamagui";
import { useTheme } from "../contexts/ThemeContext";
import { useLocalization } from "../contexts/LocalizationContext";
import { useRouter } from "expo-router";
import ButtonGradient from "../components/common/ButtonGradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function ProfileCompleted() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const router = useRouter();

  // Animations
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation d'entrée séquentielle
    const animations = [
      // Icône de validation qui apparaît avec un effet de rebond
      Animated.sequence([
        Animated.timing(checkmarkScale, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(checkmarkScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),

      // Texte principal qui apparaît
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),

      // Bouton qui glisse vers le haut
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        delay: 600,
        useNativeDriver: true,
      }),
    ];

    // Lancer toutes les animations
    Animated.parallel(animations).start();

    // Animation de pulsation continue pour l'icône
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [checkmarkScale, opacityAnim, slideUpAnim, pulseAnim]);

  const handleAccessApp = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$5">
        {/* Icône de validation avec animation */}
        <Animated.View
          style={{
            transform: [{ scale: checkmarkScale }, { scale: pulseAnim }],
            marginBottom: 40,
          }}
        >
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: colors.primary + "20",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 3,
              borderColor: colors.primary,
            }}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={60}
              color={colors.primary}
            />
          </View>
        </Animated.View>

        {/* Texte de félicitations */}
        <Animated.View
          style={{
            opacity: opacityAnim,
            alignItems: "center",
            marginBottom: 60,
          }}
        >
          <Text
            fontSize={32}
            fontWeight="bold"
            color={colors.primary}
            textAlign="center"
            marginBottom="$4"
          >
            {t("congratulations")}
          </Text>

          <Text
            fontSize={20}
            fontWeight="600"
            color={colors.foreground}
            textAlign="center"
            marginBottom="$3"
          >
            {t("profileNowComplete")}
          </Text>

          <Text
            fontSize={16}
            color={colors.mutedForeground}
            textAlign="center"
            lineHeight={24}
          >
            {t("readyToDiscover")}
          </Text>
        </Animated.View>

        {/* Bouton d'accès à l'app */}
        <Animated.View
          style={{
            transform: [{ translateY: slideUpAnim }],
            opacity: opacityAnim,
            width: "100%",
            maxWidth: 300,
          }}
        >
          <ButtonGradient
            title={t("discoverCircl")}
            onPress={handleAccessApp}
            size="large"
          />

          <Text
            fontSize={14}
            color={colors.mutedForeground}
            textAlign="center"
            marginTop="$3"
            fontStyle="italic"
          >
            {t("meetShareEvolve")}
          </Text>
        </Animated.View>
      </YStack>
    </SafeAreaView>
  );
}
