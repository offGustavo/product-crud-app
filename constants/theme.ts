/**
 * Material Design 3 Theme with Purple Color Scheme
 * Based on Google's Material Design 3 specifications
 */

import { Platform } from "react-native";

// Material Design 3 Purple Color Palette
export const MD3Colors = {
  // Primary Colors (Purple)
  primary: "#6750A4",
  onPrimary: "#FFFFFF",
  primaryContainer: "#E8DEF8",
  onPrimaryContainer: "#21005D",

  // Secondary Colors (Purple Accent)
  secondary: "#625B71",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#E8DEF8",
  onSecondaryContainer: "#1D192B",

  // Tertiary Colors (Pink)
  tertiary: "#7D5260",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#FFD8E4",
  onTertiaryContainer: "#31111D",

  // Error Colors
  error: "#BA1A1A",
  errorContainer: "#FFDAD6",
  onError: "#FFFFFF",
  onErrorContainer: "#410002",

  // Background Colors
  background: "#FEF7FF",
  onBackground: "#1D1B20",
  surface: "#FEF7FF",
  onSurface: "#1D1B20",

  // Surface Variants
  surfaceVariant: "#E7E0EC",
  onSurfaceVariant: "#49454F",
  surfaceContainer: "#F3EDF7",
  surfaceContainerHigh: "#ECE6F0",
  surfaceContainerHighest: "#E6E0E9",

  // Outline Colors
  outline: "#79747E",
  outlineVariant: "#CAC4D0",

  // Inverse Colors
  inverseSurface: "#322F35",
  inverseOnSurface: "#F5EFF7",
  inversePrimary: "#D0BCFF",

  // Shadow and Scrim
  shadow: "#000000",
  scrim: "#000000",

  // Success Colors (Custom)
  success: "#4CAF50",
  onSuccess: "#FFFFFF",
  successContainer: "#E8F3E8",
  onSuccessContainer: "#1B5E20",

  // Warning Colors (Custom)
  warning: "#FF9800",
  onWarning: "#FFFFFF",
  warningContainer: "#FFF3E0",
  onWarningContainer: "#E65100",

  // Info Colors (Custom)
  info: "#2196F3",
  onInfo: "#FFFFFF",
  infoContainer: "#E3F2FD",
  onInfoContainer: "#0D47A1",

  // Disabled States
  disabled: "#79747E",
  onDisabled: "#CAC4D0",
};

// Dark Theme Colors (for future implementation)
export const MD3ColorsDark = {
  // Primary Colors
  primary: "#D0BCFF",
  onPrimary: "#381E72",
  primaryContainer: "#4F378B",
  onPrimaryContainer: "#E8DEF8",

  // Secondary Colors
  secondary: "#CCC2DC",
  onSecondary: "#332D41",
  secondaryContainer: "#4A4458",
  onSecondaryContainer: "#E8DEF8",

  // Tertiary Colors
  tertiary: "#EFB8C8",
  onTertiary: "#492532",
  tertiaryContainer: "#633B48",
  onTertiaryContainer: "#FFD8E4",

  // Error Colors
  error: "#FFB4AB",
  errorContainer: "#93000A",
  onError: "#690005",
  onErrorContainer: "#FFDAD6",

  // Background Colors
  background: "#141218",
  onBackground: "#E6E0E9",
  surface: "#141218",
  onSurface: "#E6E0E9",

  // Surface Variants
  surfaceVariant: "#49454F",
  onSurfaceVariant: "#CAC4D0",
  surfaceContainer: "#211F26",
  surfaceContainerHigh: "#2B2930",
  surfaceContainerHighest: "#36343B",

  // Outline Colors
  outline: "#938F99",
  outlineVariant: "#49454F",

  // Inverse Colors
  inverseSurface: "#E6E0E9",
  inverseOnSurface: "#322F35",
  inversePrimary: "#6750A4",

  // Shadow and Scrim
  shadow: "#000000",
  scrim: "#000000",

  // Custom Colors
  success: "#81C784",
  onSuccess: "#1B5E20",
  successContainer: "#2E7D32",
  onSuccessContainer: "#E8F3E8",

  warning: "#FFB74D",
  onWarning: "#E65100",
  warningContainer: "#F57C00",
  onWarningContainer: "#FFF3E0",

  info: "#64B5F6",
  onInfo: "#0D47A1",
  infoContainer: "#1976D2",
  onInfoContainer: "#E3F2FD",

  disabled: "#938F99",
  onDisabled: "#49454F",
};

// Legacy Colors for compatibility
export const Colors = {
  light: {
    text: MD3Colors.onBackground,
    background: MD3Colors.background,
    tint: MD3Colors.primary,
    icon: MD3Colors.onSurfaceVariant,
    tabIconDefault: MD3Colors.onSurfaceVariant,
    tabIconSelected: MD3Colors.primary,
    primary: MD3Colors.primary,
    secondary: MD3Colors.secondary,
    surface: MD3Colors.surface,
    error: MD3Colors.error,
  },
  dark: {
    text: MD3ColorsDark.onBackground,
    background: MD3ColorsDark.background,
    tint: MD3ColorsDark.primary,
    icon: MD3ColorsDark.onSurfaceVariant,
    tabIconDefault: MD3ColorsDark.onSurfaceVariant,
    tabIconSelected: MD3ColorsDark.primary,
    primary: MD3ColorsDark.primary,
    secondary: MD3ColorsDark.secondary,
    surface: MD3ColorsDark.surface,
    error: MD3ColorsDark.error,
  },
};

// Typography Scale (Material Design 3)
export const Typography = {
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: -0.25,
    fontWeight: "400" as const,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
    fontWeight: "400" as const,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
    fontWeight: "400" as const,
  },
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
    fontWeight: "400" as const,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
    fontWeight: "400" as const,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
    fontWeight: "400" as const,
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
    fontWeight: "500" as const,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontWeight: "500" as const,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: "500" as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontWeight: "400" as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    fontWeight: "400" as const,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: "500" as const,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: "500" as const,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: "500" as const,
  },
};

// Elevation Tokens (Material Design 3)
export const Elevation = {
  level0: {
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  level1: {
    elevation: 1,
    shadowColor: MD3Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  level2: {
    elevation: 3,
    shadowColor: MD3Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  level3: {
    elevation: 6,
    shadowColor: MD3Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  level4: {
    elevation: 8,
    shadowColor: MD3Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  level5: {
    elevation: 12,
    shadowColor: MD3Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
};

// Border Radius (Material Design 3)
export const BorderRadius = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 28,
  full: 9999,
};

// Spacing Scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// Font Configuration
export const Fonts = Platform.select({
  ios: {
    regular: "System",
    medium: "System",
    bold: "System",
  },
  android: {
    regular: "Roboto",
    medium: "Roboto-Medium",
    bold: "Roboto-Bold",
  },
  default: {
    regular: "System",
    medium: "System",
    bold: "System",
  },
});

// Material You Dynamic Color (for future implementation)
export const createMaterialYouTheme = (seedColor: string) => {
  // This would implement Material You dynamic theming
  // For now, return our default purple theme
  return MD3Colors;
};

// Theme Configuration
export const Theme = {
  colors: MD3Colors,
  typography: Typography,
  elevation: Elevation,
  borderRadius: BorderRadius,
  spacing: Spacing,
  fonts: Fonts,
};

export default Theme;
