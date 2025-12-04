import { useState, useEffect } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MD3Colors, MD3ColorsDark } from "../constants/theme";

interface AndroidColors {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  surface: string;
  onSurface: string;
  background: string;
  onBackground: string;
  surfaceTint: string;
}

interface UseAndroidColorsReturn {
  colors: typeof MD3Colors;
  isDynamic: boolean;
  isLoading: boolean;
  seedColor: string;
  setSeedColor: (color: string) => void;
  resetToDefault: () => void;
  refresh: () => Promise<void>;
}

// Demo seed colors that simulate different Android wallpapers
const DEMO_SEED_COLORS = [
  "#FF5722", // Deep Orange
  "#2196F3", // Blue
  "#4CAF50", // Green
  "#9C27B0", // Purple
  "#FF9800", // Orange
  "#607D8B", // Blue Grey
  "#795548", // Brown
  "#E91E63", // Pink
];

const STORAGE_KEY = "@android_seed_color";

/**
 * Hook that simulates Android Material You dynamic colors
 * Uses a seed color to generate a complete Material Design 3 palette
 */
export const useAndroidColors = (
  isDark: boolean = false,
): UseAndroidColorsReturn => {
  const [seedColor, setSeedColorState] = useState<string>("#006A6B");
  const [isLoading, setIsLoading] = useState(true);
  const [isDynamic, setIsDynamic] = useState(false);

  // Check if we're on Android
  const isAndroid = Platform.OS === "android";

  // Load saved seed color
  useEffect(() => {
    const loadSeedColor = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setSeedColorState(saved);
          setIsDynamic(true);
        } else if (isAndroid) {
          // On Android, simulate getting a color from wallpaper
          const randomSeed =
            DEMO_SEED_COLORS[
              Math.floor(Math.random() * DEMO_SEED_COLORS.length)
            ];
          setSeedColorState(randomSeed);
          setIsDynamic(true);
          await AsyncStorage.setItem(STORAGE_KEY, randomSeed);
        }
      } catch (error) {
        console.warn("Failed to load seed color:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSeedColor();
  }, [isAndroid]);

  // Set new seed color and save it
  const setSeedColor = async (color: string) => {
    try {
      setSeedColorState(color);
      setIsDynamic(true);
      await AsyncStorage.setItem(STORAGE_KEY, color);
    } catch (error) {
      console.warn("Failed to save seed color:", error);
    }
  };

  // Reset to default theme
  const resetToDefault = async () => {
    try {
      setSeedColorState("#006A6B");
      setIsDynamic(false);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to reset theme:", error);
    }
  };

  // Generate Material You palette from seed color
  const generatePalette = (seed: string, dark: boolean): AndroidColors => {
    const hsl = hexToHsl(seed);

    if (dark) {
      return {
        primary: adjustLightness(seed, 70),
        onPrimary: adjustLightness(seed, 10),
        primaryContainer: adjustLightness(seed, 25),
        onPrimaryContainer: adjustLightness(seed, 85),
        secondary: adjustHueAndLightness(seed, 20, 60),
        onSecondary: adjustHueAndLightness(seed, 20, 15),
        secondaryContainer: adjustHueAndLightness(seed, 20, 25),
        onSecondaryContainer: adjustHueAndLightness(seed, 20, 80),
        tertiary: adjustHueAndLightness(seed, 40, 65),
        onTertiary: adjustHueAndLightness(seed, 40, 20),
        tertiaryContainer: adjustHueAndLightness(seed, 40, 30),
        onTertiaryContainer: adjustHueAndLightness(seed, 40, 85),
        surface: "#0F1514",
        onSurface: "#E0E3E2",
        background: "#0F1514",
        onBackground: "#E0E3E2",
        surfaceTint: adjustLightness(seed, 70),
      };
    } else {
      return {
        primary: seed,
        onPrimary: "#FFFFFF",
        primaryContainer: adjustLightness(seed, 90),
        onPrimaryContainer: adjustLightness(seed, 15),
        secondary: adjustHueAndLightness(seed, 20, 35),
        onSecondary: "#FFFFFF",
        secondaryContainer: adjustHueAndLightness(seed, 20, 88),
        onSecondaryContainer: adjustHueAndLightness(seed, 20, 18),
        tertiary: adjustHueAndLightness(seed, 40, 40),
        onTertiary: "#FFFFFF",
        tertiaryContainer: adjustHueAndLightness(seed, 40, 90),
        onTertiaryContainer: adjustHueAndLightness(seed, 40, 20),
        surface: "#F7FFFE",
        onSurface: "#171D1D",
        background: "#F7FFFE",
        onBackground: "#171D1D",
        surfaceTint: seed,
      };
    }
  };

  // Create final color palette
  const createColors = (): typeof MD3Colors => {
    const baseColors = isDark ? MD3ColorsDark : MD3Colors;

    if (!isDynamic) {
      return baseColors;
    }

    const dynamicColors = generatePalette(seedColor, isDark);

    return {
      ...baseColors,
      // Override with dynamic colors
      primary: dynamicColors.primary,
      onPrimary: dynamicColors.onPrimary,
      primaryContainer: dynamicColors.primaryContainer,
      onPrimaryContainer: dynamicColors.onPrimaryContainer,
      secondary: dynamicColors.secondary,
      onSecondary: dynamicColors.onSecondary,
      secondaryContainer: dynamicColors.secondaryContainer,
      onSecondaryContainer: dynamicColors.onSecondaryContainer,
      tertiary: dynamicColors.tertiary,
      onTertiary: dynamicColors.onTertiary,
      tertiaryContainer: dynamicColors.tertiaryContainer,
      onTertiaryContainer: dynamicColors.onTertiaryContainer,
      surface: dynamicColors.surface,
      onSurface: dynamicColors.onSurface,
      background: dynamicColors.background,
      onBackground: dynamicColors.onBackground,
      surfaceTint: dynamicColors.surfaceTint,

      // Keep surface variants consistent with main surface
      surfaceVariant: adjustLightness(dynamicColors.surface, isDark ? 30 : 92),
      onSurfaceVariant: adjustLightness(
        dynamicColors.onSurface,
        isDark ? 70 : 45,
      ),
      surfaceDim: adjustLightness(dynamicColors.surface, isDark ? 15 : 85),
      surfaceBright: adjustLightness(dynamicColors.surface, isDark ? 25 : 98),
      surfaceContainer: adjustLightness(
        dynamicColors.surface,
        isDark ? 12 : 94,
      ),
      surfaceContainerLow: adjustLightness(
        dynamicColors.surface,
        isDark ? 10 : 96,
      ),
      surfaceContainerLowest: adjustLightness(
        dynamicColors.surface,
        isDark ? 5 : 100,
      ),
      surfaceContainerHigh: adjustLightness(
        dynamicColors.surface,
        isDark ? 17 : 92,
      ),
      surfaceContainerHighest: adjustLightness(
        dynamicColors.surface,
        isDark ? 22 : 90,
      ),

      // Update outline colors based on surface
      outline: adjustLightness(dynamicColors.onSurface, isDark ? 60 : 50),
      outlineVariant: adjustLightness(
        dynamicColors.onSurface,
        isDark ? 30 : 80,
      ),

      // Update inverse colors
      inverseSurface: isDark
        ? dynamicColors.surface
        : adjustLightness(dynamicColors.surface, 15),
      inverseOnSurface: isDark
        ? dynamicColors.onSurface
        : adjustLightness(dynamicColors.onSurface, 85),
      inversePrimary: isDark
        ? dynamicColors.primary
        : adjustLightness(dynamicColors.primary, 80),
    };
  };

  // Refresh function to reload colors
  const refresh = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSeedColorState(saved);
        setIsDynamic(true);
      }
    } catch (error) {
      console.warn("Failed to refresh colors:", error);
    }
  };

  return {
    colors: createColors(),
    isDynamic: isDynamic && isAndroid,
    isLoading,
    seedColor,
    setSeedColor,
    resetToDefault,
    refresh,
  };
};

// Utility functions
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  h = h % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function adjustLightness(hex: string, lightness: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex(hsl.h, hsl.s, lightness);
}

function adjustHueAndLightness(
  hex: string,
  hueShift: number,
  lightness: number,
): string {
  const hsl = hexToHsl(hex);
  return hslToHex((hsl.h + hueShift) % 360, hsl.s, lightness);
}

export default useAndroidColors;
