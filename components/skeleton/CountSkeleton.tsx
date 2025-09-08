import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export const CountSkeleton: React.FC = () => {
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
    <Animated.View
      style={{
        width: 30,
        height: 24,
        backgroundColor: colors.foreground + "20",
        borderRadius: 6,
        opacity: fadeAnim,
      }}
    />
  );
};
