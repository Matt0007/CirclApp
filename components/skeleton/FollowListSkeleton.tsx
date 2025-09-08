import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import {  View, XStack, YStack } from "tamagui";
import { useTheme } from "../../contexts/ThemeContext";

export const FollowListSkeleton: React.FC = () => {
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

  const SkeletonItem = () => (
    <XStack alignItems="center" paddingHorizontal="$4" paddingVertical="$3">
      {/* Avatar skeleton */}
      <Animated.View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: colors.mutedForeground + "20",
          opacity: fadeAnim,
          marginRight: 12,
        }}
      />

      {/* Informations skeleton */}
      <YStack flex={1} space="$2">
        <Animated.View
          style={{
            width: "70%",
            height: 16,
            backgroundColor: colors.mutedForeground + "20",
            borderRadius: 8,
            opacity: fadeAnim,
          }}
        />
        <Animated.View
          style={{
            width: "50%",
            height: 12,
            backgroundColor: colors.mutedForeground + "20",
            borderRadius: 6,
            opacity: fadeAnim,
          }}
        />
      </YStack>

      {/* Bouton skeleton */}
      <Animated.View
        style={{
          width: 80,
          height: 32,
          backgroundColor: colors.mutedForeground + "20",
          borderRadius: 16,
          opacity: fadeAnim,
        }}
      />
    </XStack>
  );

  return (
    <View flex={1}>
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </View>
  );
};
