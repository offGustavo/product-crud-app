import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Surface } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useCustomTheme } from "../contexts/ThemeContext";

const ThemeTestIndicator: React.FC = () => {
  const { colors, currentTheme, themeVersion, isChanging } = useCustomTheme();
  const [changeCount, setChangeCount] = useState(0);

  // Track theme changes
  useEffect(() => {
    setChangeCount((prev) => prev + 1);
    console.log(
      `🔥 ThemeTestIndicator: Hot reload detected! Theme: ${currentTheme}, Version: ${themeVersion}`,
    );
  }, [currentTheme, themeVersion]);

  return (
    <Surface
      style={[
        styles.container,
        {
          backgroundColor: colors.primaryContainer,
          borderColor: colors.primary,
        },
      ]}
      elevation={2}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={isChanging ? "sync" : "palette"}
            size={20}
            color={colors.onPrimaryContainer}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.onPrimaryContainer }]}>
            Hot Reload Test
          </Text>
          <Text style={[styles.subtitle, { color: colors.onPrimaryContainer }]}>
            Theme: {currentTheme} • Changes: {changeCount}
          </Text>
          <Text style={[styles.detail, { color: colors.onPrimaryContainer }]}>
            Primary: {colors.primary}
          </Text>
        </View>

        {isChanging && (
          <View style={styles.statusContainer}>
            <Text style={[styles.status, { color: colors.onPrimaryContainer }]}>
              Changing...
            </Text>
          </View>
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    margin: 8,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    opacity: 0.8,
  },
  detail: {
    fontSize: 9,
    fontFamily: "monospace",
    opacity: 0.7,
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  status: {
    fontSize: 8,
    fontWeight: "500",
    textTransform: "uppercase",
  },
});

export default ThemeTestIndicator;
