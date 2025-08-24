import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { ProtectedRoute } from "../../components/ProtectedRoute";
export default function TabsLayout() {
  const { colors } = useTheme();

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
            borderTopWidth: 1,
            borderTopColor: colors.border,
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
