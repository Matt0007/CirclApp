import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { ProtectedRoute } from "../../components/route/ProtectedRoute";
export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.mutedForeground,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopWidth: 0,
            paddingBottom: insets.bottom,
            height: 60 + insets.bottom,
          },
          tabBarIconStyle: {
            marginTop: 10,
          },
          tabBarButton: (props) => {
            const {
              onPress,
              accessibilityState,
              accessibilityLabel,
              children,
              ...rest
            } = props;
            return (
              <TouchableOpacity
                onPress={onPress}
                accessibilityState={accessibilityState}
                accessibilityLabel={accessibilityLabel}
                activeOpacity={0.7}
                style={rest.style}
              >
                {children}
              </TouchableOpacity>
            );
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Actualités",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size * 1.1} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="social"
          options={{
            title: "Social",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size * 1.1} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="sport"
          options={{
            title: "Sport",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="fitness" size={size * 1.1} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size * 1.1} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
