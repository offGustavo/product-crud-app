import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { useThemeVariant } from "../hooks/useThemeVariant";
import { ThemeVariantKey, MD3Colors } from "../constants/theme";

interface ThemeContextType {
  currentTheme: ThemeVariantKey;
  colors: typeof MD3Colors;
  isDark: boolean;
  setThemeVariant: (variant: ThemeVariantKey) => Promise<void>;
  resetTheme: () => Promise<void>;
  isLoading: boolean;
  isChanging: boolean;
  themeVersion: number; // Force re-render when incremented
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  const themeData = useThemeVariant();
  const [themeVersion, setThemeVersion] = React.useState(0);

  // Wrapped setThemeVariant to trigger re-render
  const setThemeVariant = useCallback(
    async (variant: ThemeVariantKey) => {
      await themeData.setThemeVariant(variant);
      setThemeVersion((prev) => prev + 1); // Force re-render
      // Small delay to ensure re-render happens
      setTimeout(() => setThemeVersion((prev) => prev + 1), 50);
    },
    [themeData],
  );

  // Wrapped resetTheme to trigger re-render
  const resetTheme = useCallback(async () => {
    await themeData.resetTheme();
    setThemeVersion((prev) => prev + 1); // Force re-render
    // Small delay to ensure re-render happens
    setTimeout(() => setThemeVersion((prev) => prev + 1), 50);
  }, [themeData]);

  const contextValue: ThemeContextType = {
    ...themeData,
    setThemeVariant,
    resetTheme,
    themeVersion,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useCustomTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a CustomThemeProvider");
  }
  return context;
};

export default CustomThemeProvider;
