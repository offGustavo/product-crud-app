import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Card,
  Title,
  Text,
  Button,
  useTheme,
  Surface,
  Chip,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useCustomTheme } from "../contexts/ThemeContext";
import { ThemeVariants } from "../constants/theme";

interface ThemePreviewProps {
  showTitle?: boolean;
  compact?: boolean;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({
  showTitle = true,
  compact = false,
}) => {
  const theme = useTheme();
  const { currentTheme, isDark } = useCustomTheme();

  const currentVariant = ThemeVariants[currentTheme];

  return (
    <View style={styles.container}>
      {showTitle && (
        <View style={styles.header}>
          <MaterialIcons
            name={currentVariant.icon as any}
            size={24}
            color={theme.colors.primary}
          />
          <Title style={[styles.title, { color: theme.colors.onSurface }]}>
            {currentVariant.name} Theme {isDark ? "(Dark)" : "(Light)"}
          </Title>
        </View>
      )}

      <View style={compact ? styles.compactGrid : styles.grid}>
        {/* Primary Colors */}
        <Surface
          style={[
            styles.colorCard,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
          elevation={1}
        >
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <MaterialIcons
              name="star"
              size={16}
              color={theme.colors.onPrimary}
            />
          </View>
          <Text
            style={[
              styles.colorLabel,
              { color: theme.colors.onPrimaryContainer },
            ]}
          >
            Primary
          </Text>
          <Text
            style={[
              styles.colorValue,
              { color: theme.colors.onPrimaryContainer },
            ]}
          >
            {theme.colors.primary}
          </Text>
        </Surface>

        {/* Secondary Colors */}
        <Surface
          style={[
            styles.colorCard,
            { backgroundColor: theme.colors.secondaryContainer },
          ]}
          elevation={1}
        >
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: theme.colors.secondary },
            ]}
          >
            <MaterialIcons
              name="palette"
              size={16}
              color={theme.colors.onSecondary}
            />
          </View>
          <Text
            style={[
              styles.colorLabel,
              { color: theme.colors.onSecondaryContainer },
            ]}
          >
            Secondary
          </Text>
          <Text
            style={[
              styles.colorValue,
              { color: theme.colors.onSecondaryContainer },
            ]}
          >
            {theme.colors.secondary}
          </Text>
        </Surface>

        {/* Tertiary Colors */}
        <Surface
          style={[
            styles.colorCard,
            { backgroundColor: theme.colors.tertiaryContainer },
          ]}
          elevation={1}
        >
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: theme.colors.tertiary },
            ]}
          >
            <MaterialIcons
              name="brush"
              size={16}
              color={theme.colors.onTertiary}
            />
          </View>
          <Text
            style={[
              styles.colorLabel,
              { color: theme.colors.onTertiaryContainer },
            ]}
          >
            Tertiary
          </Text>
          <Text
            style={[
              styles.colorValue,
              { color: theme.colors.onTertiaryContainer },
            ]}
          >
            {theme.colors.tertiary}
          </Text>
        </Surface>
      </View>

      {!compact && (
        <View style={styles.componentsDemo}>
          <Text style={[styles.demoTitle, { color: theme.colors.onSurface }]}>
            Component Examples
          </Text>

          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              icon="check"
              style={[
                styles.demoButton,
                { backgroundColor: theme.colors.primary },
              ]}
              labelStyle={{ color: theme.colors.onPrimary }}
            >
              Primary
            </Button>

            <Button
              mode="outlined"
              icon="favorite"
              style={[
                styles.demoButton,
                { borderColor: theme.colors.secondary },
              ]}
              labelStyle={{ color: theme.colors.secondary }}
            >
              Secondary
            </Button>

            <Button
              mode="contained"
              icon="star"
              style={[
                styles.demoButton,
                { backgroundColor: theme.colors.tertiaryContainer },
              ]}
              labelStyle={{ color: theme.colors.onTertiaryContainer }}
            >
              Tertiary
            </Button>
          </View>

          <View style={styles.chipRow}>
            <Chip
              icon="check-circle"
              style={{ backgroundColor: theme.colors.primaryContainer }}
              textStyle={{ color: theme.colors.onPrimaryContainer }}
            >
              Success
            </Chip>
            <Chip
              icon="info"
              style={{ backgroundColor: theme.colors.surfaceVariant }}
              textStyle={{ color: theme.colors.onSurfaceVariant }}
            >
              Info
            </Chip>
            <Chip
              icon="warning"
              style={{ backgroundColor: theme.colors.errorContainer }}
              textStyle={{ color: theme.colors.onErrorContainer }}
            >
              Warning
            </Chip>
          </View>

          <Surface
            style={[
              styles.surfaceExample,
              { backgroundColor: theme.colors.surface },
            ]}
            elevation={2}
          >
            <MaterialIcons
              name="auto-awesome"
              size={32}
              color={theme.colors.primary}
            />
            <View style={styles.surfaceText}>
              <Text
                style={[styles.surfaceTitle, { color: theme.colors.onSurface }]}
              >
                Surface Example
              </Text>
              <Text
                style={[
                  styles.surfaceSubtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                This shows how surfaces look with the current theme
              </Text>
            </View>
          </Surface>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  compactGrid: {
    flexDirection: "row",
    gap: 8,
  },
  colorCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 8,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  colorLabel: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  colorValue: {
    fontSize: 9,
    fontFamily: "monospace",
    textAlign: "center",
    opacity: 0.8,
  },
  componentsDemo: {
    gap: 16,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-around",
  },
  demoButton: {
    flex: 1,
    borderRadius: 20,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  surfaceExample: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 12,
  },
  surfaceText: {
    flex: 1,
  },
  surfaceTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  surfaceSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default ThemePreview;
