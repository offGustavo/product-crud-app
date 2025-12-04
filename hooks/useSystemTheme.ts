import { useState, useEffect } from "react";
import { useColorScheme, AppState, AppStateStatus } from "react-native";
import { useAndroidColors } from "./useAndroidColors";

interface SystemThemeState {
  isDark: boolean;
  colors: any;
  isDynamic: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook that combines system color scheme detection with Android dynamic colors
 * Automatically refreshes when app becomes active or theme changes
 */
export const useSystemTheme = (): SystemThemeState => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === "dark");
  const [lastAppState, setLastAppState] = useState(AppState.currentState);

  const { colors, isDynamic, isLoading, refresh } = useAndroidColors(isDark);

  // Update dark mode when system theme changes
  useEffect(() => {
    const newIsDark = systemColorScheme === "dark";
    if (newIsDark !== isDark) {
      setIsDark(newIsDark);
    }
  }, [systemColorScheme, isDark]);

  // Handle app state changes to refresh dynamic colors
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      // When app becomes active from background, refresh dynamic colors
      // This helps detect wallpaper changes or system theme updates
      if (
        lastAppState.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        await refresh();
      }
      setLastAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
    };
  }, [lastAppState, refresh]);

  // Refresh colors when dark mode changes
  useEffect(() => {
    refresh();
  }, [isDark, refresh]);

  return {
    isDark,
    colors,
    isDynamic,
    isLoading,
    refresh: refresh,
  };
};

export default useSystemTheme;
