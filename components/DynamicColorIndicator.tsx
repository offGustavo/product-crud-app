import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useSystemTheme } from '../hooks/useSystemTheme';
import { Platform } from 'react-native';

interface DynamicColorIndicatorProps {
  variant?: 'full' | 'compact' | 'minimal';
  showPlatformInfo?: boolean;
}

const DynamicColorIndicator: React.FC<DynamicColorIndicatorProps> = ({
  variant = 'compact',
  showPlatformInfo = true,
}) => {
  const theme = useTheme();
  const { isDynamic, isLoading, colors } = useSystemTheme();
  const isAndroid = Platform.OS === 'android';
  const androidVersion = Platform.Version;
  const supportsMaterialYou = isAndroid && typeof androidVersion === 'number' && androidVersion >= 31;

  const getStatusInfo = () => {
    if (isLoading) {
      return {
        status: 'loading',
        title: 'Loading...',
        subtitle: 'Detecting system colors',
        icon: 'hourglass-empty',
        color: colors.onSurfaceVariant,
        backgroundColor: colors.surfaceVariant,
      };
    }

    if (!isAndroid) {
      return {
        status: 'unavailable',
        title: 'iOS Theme',
        subtitle: 'Dynamic colors not available',
        icon: 'phone-iphone',
        color: colors.onSurfaceVariant,
        backgroundColor: colors.surfaceVariant,
      };
    }

    if (!supportsMaterialYou) {
      return {
        status: 'unsupported',
        title: 'Android ' + androidVersion,
        subtitle: 'Requires Android 12+',
        icon: 'android',
        color: colors.warning || colors.onSurfaceVariant,
        backgroundColor: colors.warningContainer || colors.surfaceVariant,
      };
    }

    if (isDynamic) {
      return {
        status: 'active',
        title: 'Material You',
        subtitle: 'Dynamic colors active',
        icon: 'auto-awesome',
        color: colors.primary,
        backgroundColor: colors.primaryContainer,
      };
    }

    return {
      status: 'default',
      title: 'Default Theme',
      subtitle: 'Static colors',
      icon: 'palette',
      color: colors.onSurfaceVariant,
      backgroundColor: colors.surfaceVariant,
    };
  };

  const statusInfo = getStatusInfo();

  if (variant === 'minimal') {
    return (
      <View style={styles.minimalContainer}>
        <View
          style={[
            styles.minimalIndicator,
            { backgroundColor: statusInfo.backgroundColor }
          ]}
        >
          <MaterialIcons
            name={statusInfo.icon as any}
            size={12}
            color={statusInfo.color}
          />
        </View>
        <Text style={[styles.minimalText, { color: colors.onSurfaceVariant }]}>
          {statusInfo.status === 'active' ? 'Dynamic' : 'Static'}
        </Text>
      </View>
    );
  }

  if (variant === 'compact') {
    return (
      <Surface
        style={[
          styles.compactContainer,
          { backgroundColor: statusInfo.backgroundColor }
        ]}
        elevation={0}
      >
        <MaterialIcons
          name={statusInfo.icon as any}
          size={16}
          color={statusInfo.color}
        />
        <Text style={[styles.compactTitle, { color: statusInfo.color }]}>
          {statusInfo.title}
        </Text>
      </Surface>
    );
  }

  // Full variant
  return (
    <Surface
      style={[
        styles.fullContainer,
        { backgroundColor: colors.surface, borderColor: colors.outline }
      ]}
      elevation={1}
    >
      <View style={styles.fullHeader}>
        <View
          style={[
            styles.fullIconContainer,
            { backgroundColor: statusInfo.backgroundColor }
          ]}
        >
          <MaterialIcons
            name={statusInfo.icon as any}
            size={20}
            color={statusInfo.color}
          />
        </View>
        <View style={styles.fullTextContainer}>
          <Text style={[styles.fullTitle, { color: colors.onSurface }]}>
            {statusInfo.title}
          </Text>
          <Text style={[styles.fullSubtitle, { color: colors.onSurfaceVariant }]}>
            {statusInfo.subtitle}
          </Text>
        </View>
      </View>

      {showPlatformInfo && (
        <View style={styles.fullFooter}>
          <Text style={[styles.platformInfo, { color: colors.onSurfaceVariant }]}>
            {Platform.OS === 'android'
              ? `Android ${androidVersion} • ${supportsMaterialYou ? 'Material You Supported' : 'Material You Unavailable'}`
              : `iOS • Dynamic colors not supported`
            }
          </Text>
        </View>
      )}

      {isDynamic && (
        <View style={styles.colorPreview}>
          <View style={styles.colorRow}>
            <View style={[styles.colorDot, { backgroundColor: colors.primary }]} />
            <View style={[styles.colorDot, { backgroundColor: colors.secondary }]} />
            <View style={[styles.colorDot, { backgroundColor: colors.tertiary }]} />
            <View style={[styles.colorDot, { backgroundColor: colors.primaryContainer }]} />
          </View>
        </View>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  // Minimal variant
  minimalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  minimalIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minimalText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Compact variant
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  compactTitle: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.4,
  },

  // Full variant
  fullContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  fullHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fullIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullTextContainer: {
    flex: 1,
  },
  fullTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  fullSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  fullFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  platformInfo: {
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  colorPreview: {
    marginTop: 12,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default DynamicColorIndicator;
