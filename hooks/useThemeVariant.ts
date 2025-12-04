import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { ThemeVariants, ThemeVariantKey, MD3Colors } from "../constants/theme";

interface UseThemeVariantReturn {
  currentTheme: ThemeVariantKey;
  colors: typeof MD3Colors;
  isDark: boolean;
  setThemeVariant: (variant: ThemeVariantKey) => Promise<void>;
  resetTheme: () => Promise<void>;
  isLoading: boolean;
  isChanging: boolean;
}

const THEME_STORAGE_KEY = "@theme_variant";
const DEFAULT_THEME: ThemeVariantKey = "teal";

/**
 * Hook for managing theme variants (Teal, Blue, Purple, Green, Pink)
 * Persists theme selection and adapts to system dark/light mode
 */
export const useThemeVariant = (): UseThemeVariantReturn => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === "dark";

  const [currentTheme, setCurrentTheme] =
    useState<ThemeVariantKey>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);
  const [isChanging, setIsChanging] = useState(false);

  // Load saved theme variant from storage
  useEffect(() => {
    const loadThemeVariant = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved && Object.keys(ThemeVariants).includes(saved)) {
          setCurrentTheme(saved as ThemeVariantKey);
        }
      } catch (error) {
        console.warn("Failed to load theme variant:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemeVariant();
  }, []);

  // Get current colors based on theme variant and dark mode
  const colors = ThemeVariants[currentTheme][isDark ? "dark" : "light"];

  // Force re-render when theme changes
  const [, forceUpdate] = useState({});

  // Set new theme variant and save to storage
  const setThemeVariant = useCallback(
    async (variant: ThemeVariantKey) => {
      if (variant === currentTheme) return; // Don't change if same theme

      try {
        setIsChanging(true);

        // Small delay for visual feedback
        await new Promise((resolve) => setTimeout(resolve, 100));

        setCurrentTheme(variant);
        await AsyncStorage.setItem(THEME_STORAGE_KEY, variant);

        // Force re-render
        forceUpdate({});
      } catch (error) {
        console.warn("Failed to save theme variant:", error);
      } finally {
        setIsChanging(false);
      }
    },
    [currentTheme],
  );

  // Reset to default theme
  const resetTheme = useCallback(async () => {
    try {
      setIsChanging(true);

      // Small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 100));

      setCurrentTheme(DEFAULT_THEME);
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);

      // Force re-render
      forceUpdate({});
    } catch (error) {
      console.warn("Failed to reset theme:", error);
    } finally {
      setIsChanging(false);
    }
  }, []);

  return {
    currentTheme,
    colors,
    isDark,
    setThemeVariant,
    resetTheme,
    isLoading,
    isChanging,
  };
};

export default useThemeVariant;
