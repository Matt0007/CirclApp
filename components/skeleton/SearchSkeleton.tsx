import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface SearchSkeletonProps {
  count?: number;
}

export const SearchSkeleton: React.FC<SearchSkeletonProps> = ({
  count = 3,
}) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, [fadeAnim]);

  const renderSkeletonItem = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      {/* Avatar skeleton */}
      <Animated.View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          marginRight: 12,
          backgroundColor: colors.foreground + "20",
          opacity: fadeAnim,
        }}
      />

      {/* Content skeleton */}
      <View style={{ flex: 1 }}>
        {/* Name skeleton */}
        <Animated.View
          style={{
            width: "60%",
            height: 16,
            backgroundColor: colors.foreground + "20",
            borderRadius: 8,
            marginBottom: 8,
            opacity: fadeAnim,
          }}
        />

        {/* Sports skeleton */}
        <Animated.View
          style={{
            width: "40%",
            height: 12,
            backgroundColor: colors.foreground + "20",
            borderRadius: 6,
            opacity: fadeAnim,
          }}
        />
      </View>

      {/* Chevron skeleton */}
      <Animated.View
        style={{
          width: 20,
          height: 20,
          backgroundColor: colors.foreground + "20",
          borderRadius: 4,
          opacity: fadeAnim,
        }}
      />
    </View>
  );

  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index}>{renderSkeletonItem()}</View>
      ))}
    </View>
  );
};
