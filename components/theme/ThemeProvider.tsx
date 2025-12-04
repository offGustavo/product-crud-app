import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { MD3Colors, MD3ColorsDark, Theme, Typography, Elevation, Shape, Motion, Spacing } from '../../constants/theme';

interface ThemeContextType {
  colors: typeof MD3Colors;
  typography: typeof Typography;
  elevation: typeof Elevation;
  shape: typeof Shape;
  motion: typeof Motion;
  spacing: typeof Spacing;
  isDark: boolean;
  toggleTheme?: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  forceDarkMode?: boolean;
  forceLightMode?: boolean;
}

export const MaterialThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  forceDarkMode,
  forceLightMode,
}) => {
  const systemColorScheme = useColorScheme();

  let isDark = systemColorScheme === 'dark';

  if (forceDarkMode) {
    isDark = true;
  } else if (forceLightMode) {
    isDark = false;
  }

  const colors = isDark ? MD3ColorsDark : MD3Colors;

  const themeValue: ThemeContextType = {
    colors,
    typography: Typography,
    elevation: Elevation,
    shape: Shape,
    motion: Motion,
    spacing: Spacing,
    isDark,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useMaterialTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useMaterialTheme must be used within a MaterialThemeProvider');
  }
  return context;
};

// Helper hooks for specific theme parts
export const useThemeColors = () => {
  const { colors } = useMaterialTheme();
  return colors;
};

export const useThemeTypography = () => {
  const { typography } = useMaterialTheme();
  return typography;
};

export const useThemeElevation = () => {
  const { elevation } = useMaterialTheme();
  return elevation;
};

export const useThemeShape = () => {
  const { shape } = useMaterialTheme();
  return shape;
};

export const useThemeSpacing = () => {
  const { spacing } = useMaterialTheme();
  return spacing;
};

// Material Design 3 Component Helpers
export const createMD3Surface = (
  backgroundColor: string,
  elevationLevel: keyof typeof Elevation = 'level1'
) => ({
  backgroundColor,
  ...Elevation[elevationLevel],
  borderRadius: Shape.medium,
});

export const createMD3Button = (
  type: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal' = 'filled',
  colors: typeof MD3Colors
) => {
  const baseStyle = {
    borderRadius: Shape.extraLarge,
    height: 40,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  switch (type) {
    case 'filled':
      return {
        ...baseStyle,
        backgroundColor: colors.primary,
        color: colors.onPrimary,
      };
    case 'outlined':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.outline,
        color: colors.primary,
      };
    case 'text':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: colors.primary,
      };
    case 'elevated':
      return {
        ...baseStyle,
        backgroundColor: colors.surfaceContainerLow,
        color: colors.primary,
        ...Elevation.level1,
      };
    case 'tonal':
      return {
        ...baseStyle,
        backgroundColor: colors.secondaryContainer,
        color: colors.onSecondaryContainer,
      };
    default:
      return baseStyle;
  }
};

export const createMD3Card = (
  variant: 'elevated' | 'filled' | 'outlined' = 'elevated',
  colors: typeof MD3Colors
) => {
  const baseStyle = {
    borderRadius: Shape.medium,
    padding: Spacing.md,
  };

  switch (variant) {
    case 'elevated':
      return {
        ...baseStyle,
        backgroundColor: colors.surfaceContainerLow,
        ...Elevation.level1,
      };
    case 'filled':
      return {
        ...baseStyle,
        backgroundColor: colors.surfaceContainerHighest,
      };
    case 'outlined':
      return {
        ...baseStyle,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
      };
    default:
      return baseStyle;
  }
};

// Text style helpers
export const getMD3TextStyle = (
  variant: keyof typeof Typography,
  colors: typeof MD3Colors,
  colorToken: keyof typeof MD3Colors = 'onSurface'
) => ({
  ...Typography[variant],
  color: colors[colorToken],
});

export default MaterialThemeProvider;
