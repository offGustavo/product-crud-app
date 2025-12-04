/**
 * Material Design 3 Theme - Updated for Authentic Material You Experience
 * Based on Google's latest Material Design 3 specifications and Material You
 */

import { Platform } from "react-native";

// Material Design 3 Color Tokens - Light Theme
export const MD3Colors = {
  // Primary Colors (Modern Teal-Blue)
  primary: "#006A6B",
  onPrimary: "#FFFFFF",
  primaryContainer: "#9FF2F3",
  onPrimaryContainer: "#002020",

  // Secondary Colors (Complementary Teal)
  secondary: "#4A6363",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#CCE8E8",
  onSecondaryContainer: "#051F1F",

  // Tertiary Colors (Warm Accent)
  tertiary: "#456179",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#CCE5FF",
  onTertiaryContainer: "#001E31",

  // Error Colors
  error: "#BA1A1A",
  errorContainer: "#FFDAD6",
  onError: "#FFFFFF",
  onErrorContainer: "#410002",

  // Background Colors (Softer, more modern)
  background: "#F4FFFE",
  onBackground: "#161D1D",
  surface: "#F4FFFE",
  onSurface: "#161D1D",

  // Surface Variants (Better contrast)
  surfaceVariant: "#DAE5E4",
  onSurfaceVariant: "#3F4948",
  surfaceDim: "#D5DBDA",
  surfaceBright: "#F4FFFE",
  surfaceContainer: "#E8F0EF",
  surfaceContainerLow: "#EEF5F4",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerHigh: "#E2E9E8",
  surfaceContainerHighest: "#DDE3E2",

  // Outline Colors
  outline: "#6F7978",
  outlineVariant: "#BEC9C8",

  // Inverse Colors
  inverseSurface: "#2B3231",
  inverseOnSurface: "#ECF2F1",
  inversePrimary: "#83D5D6",

  // Shadow and Scrim
  shadow: "#000000",
  scrim: "#000000",

  // Success Colors (Material You Green)
  success: "#006E1C",
  onSuccess: "#FFFFFF",
  successContainer: "#97F68D",
  onSuccessContainer: "#002204",

  // Warning Colors (Material You Orange)
  warning: "#8C5000",
  onWarning: "#FFFFFF",
  warningContainer: "#FFDCBF",
  onWarningContainer: "#2D1600",

  // Info Colors (Material You Blue)
  info: "#0061A4",
  onInfo: "#FFFFFF",
  infoContainer: "#D1E4FF",
  onInfoContainer: "#001D36",

  // Surface Tint
  surfaceTint: "#006A6B",

  // Disabled States
  disabled: "#6F7978",
  onDisabled: "#BEC9C8",
};

// Dark Theme Colors (Material You Dark)
export const MD3ColorsDark = {
  // Primary Colors
  primary: "#83D5D6",
  onPrimary: "#003738",
  primaryContainer: "#004F50",
  onPrimaryContainer: "#9FF2F3",

  // Secondary Colors
  secondary: "#B0CCCC",
  onSecondary: "#1B3535",
  secondaryContainer: "#324B4B",
  onSecondaryContainer: "#CCE8E8",

  // Tertiary Colors
  tertiary: "#B0C9E8",
  onTertiary: "#1A3147",
  tertiaryContainer: "#31475F",
  onTertiaryContainer: "#CCE5FF",

  // Error Colors
  error: "#FFB4AB",
  errorContainer: "#93000A",
  onError: "#690005",
  onErrorContainer: "#FFDAD6",

  // Background Colors
  background: "#0E1514",
  onBackground: "#DDE3E2",
  surface: "#0E1514",
  onSurface: "#DDE3E2",

  // Surface Variants
  surfaceVariant: "#3F4948",
  onSurfaceVariant: "#BEC9C8",
  surfaceDim: "#0E1514",
  surfaceBright: "#343A3A",
  surfaceContainer: "#1A2120",
  surfaceContainerLow: "#161D1D",
  surfaceContainerLowest: "#090F0F",
  surfaceContainerHigh: "#252B2A",
  surfaceContainerHighest: "#303635",

  // Outline Colors
  outline: "#899391",
  outlineVariant: "#3F4948",

  // Inverse Colors
  inverseSurface: "#DDE3E2",
  inverseOnSurface: "#2B3231",
  inversePrimary: "#006A6B",

  // Shadow and Scrim
  shadow: "#000000",
  scrim: "#000000",

  // Custom Colors
  success: "#7CDA73",
  onSuccess: "#00390A",
  successContainer: "#005313",
  onSuccessContainer: "#97F68D",

  warning: "#FFB783",
  onWarning: "#4A2800",
  warningContainer: "#6A3C00",
  onWarningContainer: "#FFDCBF",

  info: "#A0C9FF",
  onInfo: "#003258",
  infoContainer: "#00497D",
  onInfoContainer: "#D1E4FF",

  // Surface Tint
  surfaceTint: "#83D5D6",

  disabled: "#899391",
  onDisabled: "#3F4948",
};

// Material Design 3 Typography Scale
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

// Material Design 3 Elevation System
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    ...(Platform.OS === "ios" && {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    }),
  },
  level2: {
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    ...(Platform.OS === "ios" && {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    }),
  },
  level3: {
    elevation: 6,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    ...(Platform.OS === "ios" && {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    }),
  },
  level4: {
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    ...(Platform.OS === "ios" && {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
    }),
  },
  level5: {
    elevation: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    ...(Platform.OS === "ios" && {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    }),
  },
};

// Material Design 3 Shape System
export const Shape = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 28,
  full: 9999,
};

// Material Design 3 Motion System
export const Motion = {
  easing: {
    standard: "cubic-bezier(0.2, 0.0, 0, 1.0)",
    decelerated: "cubic-bezier(0.0, 0.0, 0, 1.0)",
    accelerated: "cubic-bezier(0.3, 0.0, 1.0, 1.0)",
    emphasized: "cubic-bezier(0.2, 0.0, 0, 1.0)",
  },
  duration: {
    short1: 50,
    short2: 100,
    short3: 150,
    short4: 200,
    medium1: 250,
    medium2: 300,
    medium3: 350,
    medium4: 400,
    long1: 450,
    long2: 500,
    long3: 550,
    long4: 600,
    extraLong1: 700,
    extraLong2: 800,
    extraLong3: 900,
    extraLong4: 1000,
  },
};

// Spacing System (8pt grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  xxxxl: 64,
};

// Component State Layers (Material You)
export const StateLayer = {
  hover: 0.08,
  focus: 0.12,
  pressed: 0.12,
  dragged: 0.16,
};

// Font Configuration
export const Fonts = Platform.select({
  ios: {
    regular: "SF Pro Text",
    medium: "SF Pro Text",
    bold: "SF Pro Text",
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

// Material You Dynamic Color Generation
export const createMaterialYouTheme = (
  seedColor: string,
  isDark: boolean = false,
) => {
  // This is a simplified version - in production you'd use Material Color Utilities
  const baseColors = isDark ? MD3ColorsDark : MD3Colors;

  // For now, return our base theme
  // In the future, this could generate dynamic colors based on the seed color
  return {
    ...baseColors,
    primary: seedColor || baseColors.primary,
  };
};

// Component Tokens (for specific components)
export const ComponentTokens = {
  button: {
    height: {
      small: 32,
      medium: 40,
      large: 48,
    },
    borderRadius: Shape.extraLarge,
  },
  card: {
    borderRadius: Shape.medium,
    elevation: Elevation.level1,
  },
  fab: {
    size: {
      small: 40,
      medium: 56,
      large: 96,
    },
    borderRadius: Shape.large,
    elevation: Elevation.level3,
  },
  navigationBar: {
    height: 80,
    borderRadius: Shape.none,
    elevation: Elevation.level2,
  },
  appBar: {
    height: 64,
    elevation: Elevation.level0,
  },
};

// Color Theme Variants (Blue, Purple, Green, Pink)
export const BlueTheme = {
  // Primary Colors (Blue)
  primary: "#1976D2",
  onPrimary: "#FFFFFF",
  primaryContainer: "#BBDEFB",
  onPrimaryContainer: "#0D47A1",

  // Secondary Colors
  secondary: "#1565C0",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#E3F2FD",
  onSecondaryContainer: "#0277BD",

  // Tertiary Colors
  tertiary: "#42A5F5",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#E1F5FE",
  onTertiaryContainer: "#01579B",
};

export const BlueThemeDark = {
  // Primary Colors (Blue Dark)
  primary: "#90CAF9",
  onPrimary: "#0D47A1",
  primaryContainer: "#1565C0",
  onPrimaryContainer: "#BBDEFB",

  // Secondary Colors
  secondary: "#64B5F6",
  onSecondary: "#0277BD",
  secondaryContainer: "#1976D2",
  onSecondaryContainer: "#E3F2FD",

  // Tertiary Colors
  tertiary: "#81C784",
  onTertiary: "#2E7D32",
  tertiaryContainer: "#388E3C",
  onTertiaryContainer: "#C8E6C9",
};

export const PurpleTheme = {
  // Primary Colors (Purple)
  primary: "#7B1FA2",
  onPrimary: "#FFFFFF",
  primaryContainer: "#E1BEE7",
  onPrimaryContainer: "#4A148C",

  // Secondary Colors
  secondary: "#8E24AA",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#F3E5F5",
  onSecondaryContainer: "#6A1B9A",

  // Tertiary Colors
  tertiary: "#AB47BC",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#FCE4EC",
  onTertiaryContainer: "#880E4F",
};

export const PurpleThemeDark = {
  // Primary Colors (Purple Dark)
  primary: "#CE93D8",
  onPrimary: "#4A148C",
  primaryContainer: "#7B1FA2",
  onPrimaryContainer: "#E1BEE7",

  // Secondary Colors
  secondary: "#BA68C8",
  onSecondary: "#6A1B9A",
  secondaryContainer: "#8E24AA",
  onSecondaryContainer: "#F3E5F5",

  // Tertiary Colors
  tertiary: "#F8BBD9",
  onTertiary: "#880E4F",
  tertiaryContainer: "#AD1457",
  onTertiaryContainer: "#FCE4EC",
};

export const GreenTheme = {
  // Primary Colors (Green)
  primary: "#388E3C",
  onPrimary: "#FFFFFF",
  primaryContainer: "#C8E6C9",
  onPrimaryContainer: "#1B5E20",

  // Secondary Colors
  secondary: "#4CAF50",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#E8F5E8",
  onSecondaryContainer: "#2E7D32",

  // Tertiary Colors
  tertiary: "#66BB6A",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#F1F8E9",
  onTertiaryContainer: "#33691E",
};

export const GreenThemeDark = {
  // Primary Colors (Green Dark)
  primary: "#81C784",
  onPrimary: "#1B5E20",
  primaryContainer: "#2E7D32",
  onPrimaryContainer: "#C8E6C9",

  // Secondary Colors
  secondary: "#A5D6A7",
  onSecondary: "#2E7D32",
  secondaryContainer: "#388E3C",
  onSecondaryContainer: "#E8F5E8",

  // Tertiary Colors
  tertiary: "#DCEDC8",
  onTertiary: "#33691E",
  tertiaryContainer: "#689F38",
  onTertiaryContainer: "#F1F8E9",
};

export const PinkTheme = {
  // Primary Colors (Pink)
  primary: "#C2185B",
  onPrimary: "#FFFFFF",
  primaryContainer: "#F8BBD9",
  onPrimaryContainer: "#880E4F",

  // Secondary Colors
  secondary: "#E91E63",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#FCE4EC",
  onSecondaryContainer: "#AD1457",

  // Tertiary Colors
  tertiary: "#F06292",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#FFF0F3",
  onTertiaryContainer: "#B71C1C",
};

export const PinkThemeDark = {
  // Primary Colors (Pink Dark)
  primary: "#F48FB1",
  onPrimary: "#880E4F",
  primaryContainer: "#AD1457",
  onPrimaryContainer: "#F8BBD9",

  // Secondary Colors
  secondary: "#F8BBD9",
  onSecondary: "#AD1457",
  secondaryContainer: "#C2185B",
  onSecondaryContainer: "#FCE4EC",

  // Tertiary Colors
  tertiary: "#FFCDD2",
  onTertiary: "#B71C1C",
  tertiaryContainer: "#D32F2F",
  onTertiaryContainer: "#FFF0F3",
};

// Theme Variants Collection
export const ThemeVariants = {
  teal: { light: MD3Colors, dark: MD3ColorsDark, name: "Teal", icon: "water" },
  blue: {
    light: { ...MD3Colors, ...BlueTheme },
    dark: { ...MD3ColorsDark, ...BlueThemeDark },
    name: "Blue",
    icon: "water-drop",
  },
  purple: {
    light: { ...MD3Colors, ...PurpleTheme },
    dark: { ...MD3ColorsDark, ...PurpleThemeDark },
    name: "Purple",
    icon: "local-florist",
  },
  green: {
    light: { ...MD3Colors, ...GreenTheme },
    dark: { ...MD3ColorsDark, ...GreenThemeDark },
    name: "Green",
    icon: "eco",
  },
  pink: {
    light: { ...MD3Colors, ...PinkTheme },
    dark: { ...MD3ColorsDark, ...PinkThemeDark },
    name: "Pink",
    icon: "favorite",
  },
};

export type ThemeVariantKey = keyof typeof ThemeVariants;

// Complete Theme Object
export const Theme = {
  colors: MD3Colors,
  typography: Typography,
  elevation: Elevation,
  shape: Shape,
  motion: Motion,
  spacing: Spacing,
  stateLayer: StateLayer,
  fonts: Fonts,
  componentTokens: ComponentTokens,
};

export default Theme;
