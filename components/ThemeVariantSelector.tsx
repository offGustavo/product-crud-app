import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Card,
  Title,
  Text,
  Button,
  useTheme,
  Surface,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useCustomTheme } from "../contexts/ThemeContext";
import { ThemeVariants, ThemeVariantKey } from "../constants/theme";

interface ThemeVariantSelectorProps {
  showTitle?: boolean;
  compact?: boolean;
}

const ThemeVariantSelector: React.FC<ThemeVariantSelectorProps> = ({
  showTitle = true,
  compact = false,
}) => {
  const theme = useTheme();
  const { currentTheme, setThemeVariant, isLoading, isDark, isChanging } =
    useCustomTheme();
  const [changingTheme, setChangingTheme] =
    React.useState<ThemeVariantKey | null>(null);

  const handleThemeSelect = async (variant: ThemeVariantKey) => {
    if (isChanging || variant === currentTheme) return;

    setChangingTheme(variant);
    try {
      await setThemeVariant(variant);
    } finally {
      setChangingTheme(null);
    }
  };

  const getThemeColor = (variant: ThemeVariantKey) => {
    const themeColors = ThemeVariants[variant][isDark ? "dark" : "light"];
    return themeColors.primary;
  };

  return (
    <View style={styles.container}>
      {showTitle && (
        <Title style={[styles.title, { color: theme.colors.onSurface }]}>
          Choose Theme Color
        </Title>
      )}

      <View style={compact ? styles.compactGrid : styles.grid}>
        {Object.entries(ThemeVariants).map(([key, variant]) => {
          const isSelected = currentTheme === key;
          const isThemeChanging = changingTheme === key;
          const themeColor = getThemeColor(key as ThemeVariantKey);

          return (
            <Surface
              key={key}
              style={[
                compact ? styles.compactCard : styles.card,
                {
                  backgroundColor: isSelected
                    ? theme.colors.primaryContainer
                    : theme.colors.surface,
                  borderColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.outline,
                  borderWidth: isSelected ? 2 : 1,
                  opacity: isThemeChanging ? 0.6 : 1,
                },
              ]}
              elevation={isSelected ? 2 : 0}
            >
              <Button
                mode="text"
                onPress={() => handleThemeSelect(key as ThemeVariantKey)}
                disabled={isLoading || isChanging}
                style={styles.button}
                contentStyle={
                  compact ? styles.compactButtonContent : styles.buttonContent
                }
              >
                <View style={styles.themeOption}>
                  <View
                    style={[
                      compact ? styles.compactColorCircle : styles.colorCircle,
                      { backgroundColor: themeColor },
                    ]}
                  >
                    <MaterialIcons
                      name={
                        isThemeChanging
                          ? "hourglass-empty"
                          : (variant.icon as any)
                      }
                      size={compact ? 16 : 24}
                      color="white"
                    />
                  </View>

                  <Text
                    style={[
                      compact ? styles.compactThemeName : styles.themeName,
                      {
                        color: isSelected
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSurface,
                        fontWeight: isSelected ? "600" : "500",
                      },
                    ]}
                  >
                    {variant.name}
                  </Text>

                  {isSelected && !isThemeChanging && (
                    <MaterialIcons
                      name="check-circle"
                      size={compact ? 14 : 18}
                      color={theme.colors.primary}
                      style={styles.checkIcon}
                    />
                  )}
                  {isThemeChanging && (
                    <MaterialIcons
                      name="sync"
                      size={compact ? 14 : 18}
                      color={theme.colors.primary}
                      style={[styles.checkIcon, styles.rotating]}
                    />
                  )}
                </View>
              </Button>
            </Surface>
          );
        })}
      </View>

      {!compact && (
        <View style={styles.preview}>
          <Text
            style={[
              styles.previewLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Current Theme: {ThemeVariants[currentTheme].name}
          </Text>

          <View style={styles.colorPreview}>
            <View style={styles.colorRow}>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.swatchLabel,
                    { color: theme.colors.onPrimary },
                  ]}
                >
                  Primary
                </Text>
              </View>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: theme.colors.secondary },
                ]}
              >
                <Text
                  style={[
                    styles.swatchLabel,
                    { color: theme.colors.onSecondary },
                  ]}
                >
                  Secondary
                </Text>
              </View>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: theme.colors.tertiary },
                ]}
              >
                <Text
                  style={[
                    styles.swatchLabel,
                    { color: theme.colors.onTertiary },
                  ]}
                >
                  Tertiary
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  compactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-around",
  },
  card: {
    borderRadius: 16,
    minWidth: 100,
    maxWidth: 120,
  },
  compactCard: {
    borderRadius: 12,
    minWidth: 80,
    maxWidth: 90,
  },
  button: {
    margin: 0,
    borderRadius: 16,
  },
  buttonContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  compactButtonContent: {
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  themeOption: {
    alignItems: "center",
    gap: 8,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  compactColorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  themeName: {
    fontSize: 12,
    textAlign: "center",
    letterSpacing: 0.4,
  },
  compactThemeName: {
    fontSize: 10,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  checkIcon: {
    position: "absolute",
    top: -4,
    right: -4,
  },
  preview: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  previewLabel: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500",
  },
  colorPreview: {
    alignItems: "center",
  },
  colorRow: {
    flexDirection: "row",
    gap: 8,
  },
  colorSwatch: {
    width: 60,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  swatchLabel: {
    fontSize: 9,
    fontWeight: "500",
    textAlign: "center",
  },
  rotating: {
    // Animation would be handled by Animated API in a real implementation
  },
});

export default ThemeVariantSelector;
