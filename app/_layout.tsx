import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { MD3Colors, MD3ColorsDark } from "../constants/theme";
import { AuthProvider } from "../contexts/AuthContext";
import { useDatabase } from "../hooks/useDatabase";

// In your app's entry point (app/_layout.tsx or similar):
import Database from "../database/index";

// Initialize database early
Database.init().catch(console.error);

export const unstable_settings = {
  anchor: "(tabs)",
};

// Material Design 3 Theme Configuration
const MaterialThemeLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: MD3Colors.primary,
    background: MD3Colors.background,
    card: MD3Colors.surface,
    text: MD3Colors.onBackground,
    border: MD3Colors.outline,
    notification: MD3Colors.primary,
  },
};

const MaterialThemeDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: MD3ColorsDark.primary,
    background: MD3ColorsDark.background,
    card: MD3ColorsDark.surface,
    text: MD3ColorsDark.onBackground,
    border: MD3ColorsDark.outline,
    notification: MD3ColorsDark.primary,
  },
};

const PaperThemeLight = {
  colors: MD3Colors,
};

const PaperThemeDark = {
  colors: MD3ColorsDark,
};

function AppContent() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <PaperProvider theme={isDark ? PaperThemeDark : PaperThemeLight}>
      <ThemeProvider value={isDark ? MaterialThemeDark : MaterialThemeLight}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar
          style={isDark ? "light" : "dark"}
          backgroundColor={
            isDark ? MD3ColorsDark.background : MD3Colors.background
          }
        />
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  const { isInitialized } = useDatabase();

  return (
    <AuthProvider isInitialized={isInitialized}>
      <AppContent />
    </AuthProvider>
  );
}
