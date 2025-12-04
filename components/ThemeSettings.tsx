import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import {
  Card,
  Title,
  Text,
  Button,
  useTheme,
  Surface,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useAndroidColors } from "../hooks/useAndroidColors";
import { useColorScheme } from "react-native";

interface ThemeSettingsProps {
  onClose?: () => void;
}

const PRESET_COLORS = [
  { name: "Ocean", color: "#006A6B", icon: "water" },
  { name: "Forest", color: "#4CAF50", icon: "forest" },
  { name: "Sunset", color: "#FF5722", icon: "wb-sunny" },
  { name: "Sky", color: "#2196F3", icon: "cloud" },
  { name: "Lavender", color: "#9C27B0", icon: "local-florist" },
  { name: "Coral", color: "#FF9800", icon: "waves" },
  { name: "Storm", color: "#607D8B", icon: "thunderstorm" },
  { name: "Earth", color: "#795548", icon: "terrain" },
  { name: "Cherry", color: "#E91E63", icon: "favorite" },
];

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ onClose }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const {
    colors,
    isDynamic,
    seedColor,
    setSeedColor,
    resetToDefault,
    isLoading,
  } = useAndroidColors(isDarkMode);

  const [selectedPreset, setSelectedPreset] = useState<string | null>(
    PRESET_COLORS.find((c) => c.color === seedColor)?.name || null,
  );

  const handlePresetSelect = async (preset: {
    name: string;
    color: string;
  }) => {
    setSelectedPreset(preset.name);
    await setSeedColor(preset.color);
  };

  const handleReset = async () => {
    setSelectedPreset(null);
    await resetToDefault();
  };

  const isAndroid = Platform.OS === "android";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Surface
        style={[styles.header, { backgroundColor: colors.primaryContainer }]}
      >
        <View style={styles.headerContent}>
          <MaterialIcons
            name="palette"
            size={32}
            color={colors.onPrimaryContainer}
          />
          <Title
            style={[styles.headerTitle, { color: colors.onPrimaryContainer }]}
          >
            Theme Settings
          </Title>
          <Text
            style={[
              styles.headerSubtitle,
              { color: colors.onPrimaryContainer },
            ]}
          >
            Customize your app&apos;s appearance
          </Text>
        </View>
      </Surface>

      {/* Material You Status */}
      {isAndroid && (
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <View style={styles.statusRow}>
              <View style={styles.statusInfo}>
                <Text style={[styles.statusTitle, { color: colors.onSurface }]}>
                  Material You
                </Text>
                <Text
                  style={[
                    styles.statusSubtitle,
                    { color: colors.onSurfaceVariant },
                  ]}
                >
                  {isDynamic ? "Dynamic colors active" : "Using default theme"}
                </Text>
              </View>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor: isDynamic
                      ? colors.primary
                      : colors.outline,
                  },
                ]}
              >
                <MaterialIcons
                  name={isDynamic ? "auto-awesome" : "palette"}
                  size={16}
                  color={isDynamic ? colors.onPrimary : colors.surface}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Current Theme Preview */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Title style={[styles.cardTitle, { color: colors.onSurface }]}>
            Current Theme
          </Title>

          <View style={styles.colorPreview}>
            <View style={styles.colorRow}>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={[styles.colorLabel, { color: colors.onPrimary }]}>
                  Primary
                </Text>
              </View>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Text
                  style={[styles.colorLabel, { color: colors.onSecondary }]}
                >
                  Secondary
                </Text>
              </View>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: colors.tertiary },
                ]}
              >
                <Text style={[styles.colorLabel, { color: colors.onTertiary }]}>
                  Tertiary
                </Text>
              </View>
            </View>

            <View style={styles.colorRow}>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: colors.primaryContainer },
                ]}
              >
                <Text
                  style={[
                    styles.colorLabel,
                    { color: colors.onPrimaryContainer },
                  ]}
                >
                  Container
                </Text>
              </View>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.colorLabel, { color: colors.onSurface }]}>
                  Surface
                </Text>
              </View>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text
                  style={[styles.colorLabel, { color: colors.onBackground }]}
                >
                  Background
                </Text>
              </View>
            </View>
          </View>

          {seedColor && (
            <View style={styles.seedColorInfo}>
              <Text
                style={[
                  styles.seedColorLabel,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Seed Color: {seedColor.toUpperCase()}
              </Text>
              <View
                style={[styles.seedColorSwatch, { backgroundColor: seedColor }]}
              />
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Color Presets */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Title style={[styles.cardTitle, { color: colors.onSurface }]}>
            Color Presets
          </Title>
          <Text
            style={[styles.cardSubtitle, { color: colors.onSurfaceVariant }]}
          >
            Choose a color theme for your app
          </Text>

          <View style={styles.presetGrid}>
            {PRESET_COLORS.map((preset) => (
              <Button
                key={preset.name}
                mode={selectedPreset === preset.name ? "contained" : "outlined"}
                onPress={() => handlePresetSelect(preset)}
                style={[
                  styles.presetButton,
                  selectedPreset === preset.name && {
                    backgroundColor: colors.primaryContainer,
                  },
                ]}
                contentStyle={styles.presetButtonContent}
                labelStyle={{
                  color:
                    selectedPreset === preset.name
                      ? colors.onPrimaryContainer
                      : colors.onSurface,
                  fontSize: 12,
                  fontWeight: "500",
                }}
                disabled={isLoading}
              >
                <View style={styles.presetContent}>
                  <View
                    style={[
                      styles.presetColorSwatch,
                      { backgroundColor: preset.color },
                    ]}
                  >
                    <MaterialIcons
                      name={preset.icon as any}
                      size={16}
                      color="white"
                    />
                  </View>
                  <Text
                    style={[
                      styles.presetName,
                      {
                        color:
                          selectedPreset === preset.name
                            ? colors.onPrimaryContainer
                            : colors.onSurface,
                      },
                    ]}
                  >
                    {preset.name}
                  </Text>
                </View>
              </Button>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Theme Actions */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Title style={[styles.cardTitle, { color: colors.onSurface }]}>
            Theme Actions
          </Title>

          <Button
            mode="outlined"
            onPress={handleReset}
            style={[styles.actionButton, { borderColor: colors.outline }]}
            contentStyle={styles.actionButtonContent}
            labelStyle={{ color: colors.onSurface }}
            icon="refresh"
            disabled={isLoading || !isDynamic}
          >
            Reset to Default
          </Button>

          {!isAndroid && (
            <View style={styles.androidNote}>
              <MaterialIcons
                name="info"
                size={16}
                color={colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.androidNoteText,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                Dynamic colors work best on Android 12+
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Close Button */}
      {onClose && (
        <Button
          mode="contained"
          onPress={onClose}
          style={[styles.closeButton, { backgroundColor: colors.primary }]}
          contentStyle={styles.closeButtonContent}
          labelStyle={{ color: colors.onPrimary }}
        >
          Done
        </Button>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    marginBottom: 16,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.7,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  statusSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  colorPreview: {
    marginTop: 16,
  },
  colorRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  colorSwatch: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  colorLabel: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  seedColorInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  seedColorLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  seedColorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
  },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  presetButton: {
    flexBasis: "48%",
    borderRadius: 12,
    marginBottom: 8,
  },
  presetButtonContent: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  presetContent: {
    alignItems: "center",
    gap: 8,
  },
  presetColorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  presetName: {
    fontSize: 12,
    fontWeight: "500",
  },
  actionButton: {
    borderRadius: 28,
    marginBottom: 12,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  androidNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  androidNoteText: {
    fontSize: 12,
    flex: 1,
  },
  closeButton: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 28,
  },
  closeButtonContent: {
    paddingVertical: 12,
  },
});

export default ThemeSettings;
