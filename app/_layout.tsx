import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useMemo, useEffect } from "react";

import { AuthProvider } from "../contexts/AuthContext";
import { useDatabase } from "../hooks/useDatabase";
import { CustomThemeProvider, useCustomTheme } from "../contexts/ThemeContext";

// In your app's entry point (app/_layout.tsx or similar):
import Database from "../database/index";

// Initialize database early
Database.init().catch(console.error);

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppContent() {
  const {
    colors: themeColors,
    isDark,
    themeVersion,
    currentTheme,
  } = useCustomTheme();

  // Debug logging for theme changes
  useEffect(() => {
    console.log(
      `🎨 Theme changed to: ${currentTheme}, Version: ${themeVersion}, Dark: ${isDark}`,
    );
    console.log(`🎨 Primary color: ${themeColors.primary}`);
  }, [currentTheme, themeVersion, isDark, themeColors.primary]);

  // Enhanced Paper Theme with dynamic colors - useMemo for hot reload
  const PaperTheme = useMemo(() => {
    const theme = {
      colors: {
        ...themeColors,
        // React Native Paper specific mappings
        backdrop: themeColors.scrim,
        onSurfaceDisabled: themeColors.onSurface + "38", // 38 = 22% opacity in hex
        surfaceDisabled: themeColors.onSurface + "12", // 12 = 7% opacity in hex
      },
      roundness: 12,
      animation: {
        scale: 1.0,
      },
    };
    console.log(`🎨 PaperTheme updated with primary: ${theme.colors.primary}`);
    return theme;
  }, [themeColors]);

  // Navigation theme based on current colors
  const NavigationTheme = useMemo(() => {
    const navTheme = {
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        primary: themeColors.primary,
        background: themeColors.background,
        card: themeColors.surface,
        text: themeColors.onBackground,
        border: themeColors.outline,
        notification: themeColors.primary,
      },
    };
    console.log(
      `🎨 NavigationTheme updated with primary: ${navTheme.colors.primary}`,
    );
    return navTheme;
  }, [themeColors, isDark]);

  return (
    <SafeAreaProvider key={`theme-${currentTheme}-${themeVersion}`}>
      <PaperProvider
        theme={PaperTheme}
        key={`paper-${currentTheme}-${themeVersion}`}
      >
        <ThemeProvider value={NavigationTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar
            style={isDark ? "light" : "dark"}
            backgroundColor={themeColors.background}
          />
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  const { isInitialized } = useDatabase();

  return (
    <AuthProvider isInitialized={isInitialized}>
      <CustomThemeProvider>
        <AppContent />
      </CustomThemeProvider>
    </AuthProvider>
  );
}
