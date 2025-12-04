import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCustomTheme } from "../../contexts/ThemeContext";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();
  const { colors } = useCustomTheme();

  if (!isAuthenticated) {
    return (
      <Tabs
        screenOptions={{
          tabBarStyle: { display: "none" },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="register"
          options={{
            title: "Authentication",
            headerShown: false,
          }}
        />
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="create" options={{ href: null }} />
        <Tabs.Screen name="edit" options={{ href: null }} />
      </Tabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: colors.onSurface,
        headerTitleStyle: {
          fontWeight: "500",
          fontSize: 22,
          fontFamily: "Roboto-Medium",
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom + 8, 16),
          height: 80 + Math.max(insets.bottom, 0),
          elevation: 3,
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
          fontFamily: "Roboto-Medium",
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Products",
          headerTitle: "My Products",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? "inventory" : "inventory-2"}
              size={focused ? 28 : 24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Add Product",
          headerTitle: "New Product",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={focused ? 28 : 24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: "Profile",
          headerTitle: "My Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name={focused ? "person" : "person-outline"}
              size={focused ? 28 : 24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="edit"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
