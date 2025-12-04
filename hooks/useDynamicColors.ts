import { useState, useEffect } from 'react';
import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3Colors, MD3ColorsDark } from '../constants/theme';

interface DynamicColors {
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
  surfaceVariant: string;
  onSurfaceVariant: string;
  background: string;
  onBackground: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  outline: string;
  outlineVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

interface UseDynamicColorsReturn {
  colors: typeof MD3Colors;
  isDynamic: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

// Fallback colors when dynamic colors aren't available
const FALLBACK_LIGHT = MD3Colors;
const FALLBACK_DARK = MD3ColorsDark;

// Android Material You color keys mapping
const ANDROID_COLOR_KEYS = {
  system_accent1_0: 'background',
  system_accent1_10: 'onPrimaryContainer',
  system_accent1_50: 'primaryContainer',
  system_accent1_100: 'primary',
  system_accent1_200: 'onPrimary',
  system_accent2_50: 'secondaryContainer',
  system_accent2_100: 'secondary',
  system_accent2_200: 'onSecondary',
  system_accent3_50: 'tertiaryContainer',
  system_accent3_100: 'tertiary',
  system_accent3_200: 'onTertiary',
  system_neutral1_0: 'surface',
  system_neutral1_10: 'onBackground',
  system_neutral1_50: 'surfaceVariant',
  system_neutral1_100: 'onSurfaceVariant',
  system_neutral1_900: 'onSurface',
  system_neutral2_100: 'outline',
  system_neutral2_50: 'outlineVariant',
} as const;

// Storage key for caching dynamic colors
const DYNAMIC_COLORS_STORAGE_KEY = '@dynamic_colors_cache';

/**
 * Hook to detect and use Android Material You dynamic colors
 * Falls back to default theme colors on iOS or when dynamic colors aren't available
 */
export const useDynamicColors = (isDark: boolean = false): UseDynamicColorsReturn => {
  const [dynamicColors, setDynamicColors] = useState<Partial<DynamicColors> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDynamic, setIsDynamic] = useState(false);

  // Check if device supports Material You (Android 12+)
  const supportsDynamicColors = (): boolean => {
    if (Platform.OS !== 'android') return false;

    const androidVersion = Platform.Version;
    return typeof androidVersion === 'number' && androidVersion >= 31; // Android 12 = API 31
  };

  // Extract colors from Android system resources
  const extractAndroidDynamicColors = async (): Promise<Partial<DynamicColors> | null> => {
    if (!supportsDynamicColors()) return null;

    try {
      // Try to get colors from Android's system resources
      const { PlatformConstants } = NativeModules;

      if (!PlatformConstants) return null;

      // This would require native module implementation
      // For now, we'll simulate by checking if we can access system colors
      const colors: Partial<DynamicColors> = {};

      // Mock implementation - in real app, this would call native Android methods
      // to extract colors from @android:color/system_accent1_100 etc.

      return colors;
    } catch (error) {
      console.warn('Failed to extract dynamic colors from Android:', error);
      return null;
    }
  };

  // Generate color palette from a seed color (simplified Material You algorithm)
  const generateMaterialYouPalette = (seedColor: string, isDark: boolean): Partial<DynamicColors> => {
    // This is a simplified version of Material You color generation
    // In production, you'd use the official Material Color Utilities library

    const hsl = hexToHsl(seedColor);

    if (isDark) {
      return {
        primary: hslToHex(hsl.h, Math.min(hsl.s, 80), 80),
        onPrimary: hslToHex(hsl.h, hsl.s, 20),
        primaryContainer: hslToHex(hsl.h, hsl.s, 30),
        onPrimaryContainer: hslToHex(hsl.h, Math.min(hsl.s, 80), 90),
        secondary: hslToHex((hsl.h + 30) % 360, Math.max(hsl.s - 20, 20), 70),
        onSecondary: hslToHex((hsl.h + 30) % 360, hsl.s, 20),
        secondaryContainer: hslToHex((hsl.h + 30) % 360, hsl.s, 30),
        onSecondaryContainer: hslToHex((hsl.h + 30) % 360, Math.max(hsl.s - 20, 20), 85),
        tertiary: hslToHex((hsl.h + 60) % 360, Math.max(hsl.s - 10, 30), 75),
        onTertiary: hslToHex((hsl.h + 60) % 360, hsl.s, 25),
        tertiaryContainer: hslToHex((hsl.h + 60) % 360, hsl.s, 35),
        onTertiaryContainer: hslToHex((hsl.h + 60) % 360, Math.max(hsl.s - 10, 30), 90),
        surface: '#0E1514',
        onSurface: '#DDE3E2',
        surfaceVariant: '#3F4948',
        onSurfaceVariant: '#BEC9C8',
        background: '#0E1514',
        onBackground: '#DDE3E2',
        error: '#FFB4AB',
        onError: '#690005',
        errorContainer: '#93000A',
        onErrorContainer: '#FFDAD6',
        outline: '#899391',
        outlineVariant: '#3F4948',
        inverseSurface: '#DDE3E2',
        inverseOnSurface: '#2B3231',
        inversePrimary: seedColor,
      };
    } else {
      return {
        primary: seedColor,
        onPrimary: '#FFFFFF',
        primaryContainer: hslToHex(hsl.h, Math.min(hsl.s + 20, 100), 92),
        onPrimaryContainer: hslToHex(hsl.h, hsl.s, 15),
        secondary: hslToHex((hsl.h + 30) % 360, Math.max(hsl.s - 20, 20), 40),
        onSecondary: '#FFFFFF',
        secondaryContainer: hslToHex((hsl.h + 30) % 360, Math.max(hsl.s - 10, 30), 90),
        onSecondaryContainer: hslToHex((hsl.h + 30) % 360, hsl.s, 20),
        tertiary: hslToHex((hsl.h + 60) % 360, Math.max(hsl.s - 10, 30), 45),
        onTertiary: '#FFFFFF',
        tertiaryContainer: hslToHex((hsl.h + 60) % 360, Math.max(hsl.s - 10, 30), 92),
        onTertiaryContainer: hslToHex((hsl.h + 60) % 360, hsl.s, 22),
        surface: '#F4FFFE',
        onSurface: '#161D1D',
        surfaceVariant: '#DAE5E4',
        onSurfaceVariant: '#3F4948',
        background: '#F4FFFE',
        onBackground: '#161D1D',
        error: '#BA1A1A',
        onError: '#FFFFFF',
        errorContainer: '#FFDAD6',
        onErrorContainer: '#410002',
        outline: '#6F7978',
        outlineVariant: '#BEC9C8',
        inverseSurface: '#2B3231',
        inverseOnSurface: '#ECF2F1',
        inversePrimary: hslToHex(hsl.h, Math.min(hsl.s, 80), 80),
      };
    }
  };

  // Try to detect wallpaper color (Android 8.1+)
  const detectWallpaperColor = async (): Promise<string | null> => {
    if (Platform.OS !== 'android') return null;

    try {
      // This would require native implementation
      // For now, we'll check if we have cached color or generate a sample
      const cached = await AsyncStorage.getItem('@wallpaper_color');
      if (cached) return cached;

      // Mock dominant color detection
      // In real implementation, this would use WallpaperManager.getWallpaperColors()
      return null;
    } catch (error) {
      console.warn('Failed to detect wallpaper color:', error);
      return null;
    }
  };

  // Load cached colors
  const loadCachedColors = async (): Promise<Partial<DynamicColors> | null> => {
    try {
      const cached = await AsyncStorage.getItem(DYNAMIC_COLORS_STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Failed to load cached colors:', error);
      return null;
    }
  };

  // Save colors to cache
  const saveDynamicColors = async (colors: Partial<DynamicColors>) => {
    try {
      await AsyncStorage.setItem(DYNAMIC_COLORS_STORAGE_KEY, JSON.stringify(colors));
    } catch (error) {
      console.warn('Failed to cache dynamic colors:', error);
    }
  };

  // Main function to fetch dynamic colors
  const fetchDynamicColors = async (): Promise<void> => {
    setIsLoading(true);

    try {
      // First, try to load cached colors
      let colors = await loadCachedColors();

      // If no cache or on Android, try to get fresh colors
      if (!colors && supportsDynamicColors()) {
        // Try Android system colors first
        colors = await extractAndroidDynamicColors();

        // If that fails, try wallpaper color
        if (!colors) {
          const wallpaperColor = await detectWallpaperColor();
          if (wallpaperColor) {
            colors = generateMaterialYouPalette(wallpaperColor, isDark);
            setIsDynamic(true);
          }
        }

        // Save to cache if we got colors
        if (colors) {
          await saveDynamicColors(colors);
          setIsDynamic(true);
        }
      }

      setDynamicColors(colors);
    } catch (error) {
      console.warn('Failed to fetch dynamic colors:', error);
      setDynamicColors(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh dynamic colors
  const refresh = async (): Promise<void> => {
    // Clear cache and fetch fresh colors
    try {
      await AsyncStorage.removeItem(DYNAMIC_COLORS_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear color cache:', error);
    }

    await fetchDynamicColors();
  };

  // Create final color palette
  const createColorPalette = (): typeof MD3Colors => {
    const baseColors = isDark ? FALLBACK_DARK : FALLBACK_LIGHT;

    if (!dynamicColors || !isDynamic) {
      return baseColors;
    }

    // Merge dynamic colors with fallback colors
    return {
      ...baseColors,
      ...dynamicColors,
      // Keep some colors that shouldn't change
      success: baseColors.success,
      onSuccess: baseColors.onSuccess,
      successContainer: baseColors.successContainer,
      onSuccessContainer: baseColors.onSuccessContainer,
      warning: baseColors.warning,
      onWarning: baseColors.onWarning,
      warningContainer: baseColors.warningContainer,
      onWarningContainer: baseColors.onWarningContainer,
      info: baseColors.info,
      onInfo: baseColors.onInfo,
      infoContainer: baseColors.infoContainer,
      onInfoContainer: baseColors.onInfoContainer,
      // Override with dynamic colors where available
      ...(dynamicColors.primary && { primary: dynamicColors.primary }),
      ...(dynamicColors.onPrimary && { onPrimary: dynamicColors.onPrimary }),
      ...(dynamicColors.primaryContainer && { primaryContainer: dynamicColors.primaryContainer }),
      ...(dynamicColors.onPrimaryContainer && { onPrimaryContainer: dynamicColors.onPrimaryContainer }),
      ...(dynamicColors.secondary && { secondary: dynamicColors.secondary }),
      ...(dynamicColors.onSecondary && { onSecondary: dynamicColors.onSecondary }),
      ...(dynamicColors.secondaryContainer && { secondaryContainer: dynamicColors.secondaryContainer }),
      ...(dynamicColors.onSecondaryContainer && { onSecondaryContainer: dynamicColors.onSecondaryContainer }),
      ...(dynamicColors.tertiary && { tertiary: dynamicColors.tertiary }),
      ...(dynamicColors.onTertiary && { onTertiary: dynamicColors.onTertiary }),
      ...(dynamicColors.tertiaryContainer && { tertiaryContainer: dynamicColors.tertiaryContainer }),
      ...(dynamicColors.onTertiaryContainer && { onTertiaryContainer: dynamicColors.onTertiaryContainer }),
      surfaceTint: dynamicColors.primary || baseColors.surfaceTint,
    } as typeof MD3Colors;
  };

  // Initialize on mount
  useEffect(() => {
    fetchDynamicColors();
  }, [isDark]);

  return {
    colors: createColorPalette(),
    isDynamic,
    isLoading,
    refresh,
  };
};

// Utility functions for color manipulation
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
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

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default useDynamicColors;
