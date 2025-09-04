import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { XStack, YStack } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";

export const ProfileSkeleton: React.FC = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [fadeAnim]);

  return (
    <YStack paddingHorizontal="$4" paddingTop="$5" space="$5">
      {/* Informations du profil */}
      <XStack space="$5" alignItems="flex-start">
        {/* Avatar skeleton */}
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: colors.foreground + "20",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: colors.foreground + "20",
              opacity: fadeAnim,
            }}
          />
        </View>

        {/* Statistiques et description skeleton */}
        <YStack flex={1} space="$4">
          {/* Trois statistiques skeleton */}
          <XStack space="$1" justifyContent="space-between" marginLeft="$8">
            <YStack flex={1} alignItems="flex-start" space="$1">
              <Animated.View
                style={{
                  width: 30,
                  height: 12,
                  backgroundColor: colors.foreground + "20",
                  borderRadius: 6,
                  opacity: fadeAnim,
                }}
              />
              <Animated.View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: colors.foreground + "20",
                  borderRadius: 4,
                  opacity: fadeAnim,
                }}
              />
            </YStack>
            <YStack flex={1} alignItems="flex-start" space="$1">
              <Animated.View
                style={{
                  width: 40,
                  height: 12,
                  backgroundColor: colors.foreground + "20",
                  borderRadius: 6,
                  opacity: fadeAnim,
                }}
              />
              <Animated.View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: colors.foreground + "20",
                  borderRadius: 4,
                  opacity: fadeAnim,
                }}
              />
            </YStack>
            <YStack flex={1} alignItems="flex-start" space="$1">
              <Animated.View
                style={{
                  width: 35,
                  height: 12,
                  backgroundColor: colors.foreground + "20",
                  borderRadius: 6,
                  opacity: fadeAnim,
                }}
              />
              <Animated.View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: colors.foreground + "20",
                  borderRadius: 4,
                  opacity: fadeAnim,
                }}
              />
            </YStack>
          </XStack>

          {/* Description skeleton */}
          <Animated.View
            style={{
              width: "80%",
              height: 16,
              backgroundColor: colors.foreground + "20",
              borderRadius: 8,
              opacity: fadeAnim,
            }}
          />
        </YStack>
      </XStack>

      {/* Bouton skeleton */}
      <Animated.View
        style={{
          width: "100%",
          height: 36,
          backgroundColor: colors.foreground + "20",
          borderRadius: 12,
          opacity: fadeAnim,
        }}
      />

      {/* Sports skeleton */}
      <YStack space="$3">
        <XStack space="$3">
          <Animated.View
            style={{
              width: 60,
              height: 28,
              backgroundColor: colors.foreground + "20",
              borderRadius: 12,
              opacity: fadeAnim,
            }}
          />
          <Animated.View
            style={{
              width: 80,
              height: 28,
              backgroundColor: colors.foreground + "20",
              borderRadius: 12,
              opacity: fadeAnim,
            }}
          />
          <Animated.View
            style={{
              width: 70,
              height: 28,
              backgroundColor: colors.foreground + "20",
              borderRadius: 12,
              opacity: fadeAnim,
            }}
          />
        </XStack>
      </YStack>
    </YStack>
  );
};
