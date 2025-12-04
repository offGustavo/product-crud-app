import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();

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
        tabBarActiveTintColor: "#6750A4",
        tabBarInactiveTintColor: "#79747E",
        headerStyle: {
          backgroundColor: "#FEF7FF",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#E7E0EC",
        },
        headerTintColor: "#1D1B20",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 22,
        },
        tabBarStyle: {
          backgroundColor: "#FEF7FF",
          borderTopWidth: 1,
          borderTopColor: "#E7E0EC",
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 70 + Math.max(insets.bottom - 8, 0),
          elevation: 8,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
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
              size={size}
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
              size={size}
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
              name={focused ? "account-circle" : "account-circle"}
              size={size}
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
