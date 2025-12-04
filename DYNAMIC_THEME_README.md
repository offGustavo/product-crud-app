# Sistema de Tema Dinâmico do Android (Material You)

Este documento explica como o sistema de tema dinâmico foi implementado no aplicativo, permitindo que as cores sejam extraídas do wallpaper do usuário no Android 12+ (Material You).

## 🎨 Visão Geral

O sistema de tema dinâmico permite que o aplicativo adapte automaticamente suas cores baseado no wallpaper do dispositivo do usuário, seguindo as diretrizes do Material You do Google. Esta funcionalidade está disponível principalmente no Android 12+, mas oferece fallbacks para outras plataformas.

## 📁 Arquitetura

### Hooks Personalizados

#### `useAndroidColors.ts`
- **Função**: Hook principal para gerenciamento de cores dinâmicas
- **Recursos**:
  - Detecção de suporte ao Material You (Android 12+)
  - Geração de paleta de cores a partir de uma cor seed
  - Cache de cores no AsyncStorage
  - Simulação de cores extraídas do wallpaper
  - Suporte a temas claro e escuro

#### `useSystemTheme.ts`
- **Função**: Hook que combina detecção de tema do sistema com cores dinâmicas
- **Recursos**:
  - Detecção automática de mudanças de tema (claro/escuro)
  - Atualização automática quando o app volta do background
  - Refresh de cores dinâmicas quando necessário

#### `useDynamicColors.ts`
- **Função**: Hook avançado para integração com APIs nativas do Android
- **Recursos**:
  - Integração com recursos do sistema Android
  - Extração real de cores do wallpaper (requer implementação nativa)
  - Algoritmo de geração de paleta Material You

### Componentes

#### `ThemeSettings.tsx`
Interface completa para configuração de tema:
- **Presets de cores**: 9 temas pré-definidos inspirados na natureza
- **Preview em tempo real**: Visualização das cores aplicadas
- **Status do Material You**: Indicação se cores dinâmicas estão ativas
- **Controles**: Reset para tema padrão, seleção de cores seed

#### `DynamicColorIndicator.tsx`
Indicador visual do status do tema:
- **Variantes**: Minimal, Compact, Full
- **Status**: Loading, Active, Default, Unavailable
- **Info da plataforma**: Versão do Android, suporte ao Material You

### Integração com React Native Paper

O sistema se integra perfeitamente com o React Native Paper através de temas customizados:

```typescript
const PaperTheme = {
  colors: {
    ...androidColors,
    backdrop: androidColors.scrim,
    onSurfaceDisabled: androidColors.onSurface + "38",
    surfaceDisabled: androidColors.onSurface + "12",
  },
  roundness: 12,
  animation: { scale: 1.0 },
};
```

## 🚀 Como Usar

### Implementação Básica

```typescript
import { useSystemTheme } from '../hooks/useSystemTheme';

const MyComponent = () => {
  const { colors, isDynamic, isLoading } = useSystemTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.onBackground }}>
        {isDynamic ? 'Cores dinâmicas ativas!' : 'Tema padrão'}
      </Text>
    </View>
  );
};
```

### Configuração Manual de Cores

```typescript
import { useAndroidColors } from '../hooks/useAndroidColors';

const Settings = () => {
  const { setSeedColor, resetToDefault } = useAndroidColors();

  const handleColorChange = async (color: string) => {
    await setSeedColor(color);
  };

  return (
    <Button onPress={() => handleColorChange('#FF5722')}>
      Aplicar Cor Laranja
    </Button>
  );
};
```

## 🎯 Recursos Implementados

### ✅ Funcionalidades Ativas

1. **Detecção de Plataforma**
   - Verificação se é Android 12+
   - Fallback para outras versões/plataformas

2. **Geração de Paleta**
   - Algoritmo simplificado do Material You
   - 9 presets de cores inspirados na natureza
   - Suporte a temas claro e escuro

3. **Cache Inteligente**
   - Armazenamento local de preferências
   - Restauração automática ao abrir o app

4. **Interface de Configuração**
   - Tela completa de configurações
   - Preview em tempo real
   - Indicadores visuais de status

5. **Integração Completa**
   - Tab bar dinâmica
   - Componentes com cores adaptativas
   - StatusBar sincronizada

### 🔄 Funcionalidades Simuladas

1. **Extração do Wallpaper**
   - Simulação de cores dominantes
   - Cores aleatórias para demonstração
   - Preparado para implementação nativa

2. **APIs do Sistema**
   - Interface preparada para WallpaperManager
   - Tokens de cores do sistema Android

## 🛠️ Implementação Técnica

### Algoritmo de Geração de Cores

O sistema usa um algoritmo simplificado baseado no Material You:

```typescript
const generatePalette = (seedColor: string, isDark: boolean) => {
  const hsl = hexToHsl(seedColor);
  
  return {
    primary: seedColor,
    onPrimary: '#FFFFFF',
    primaryContainer: adjustLightness(seedColor, 90),
    // ... outras cores geradas matematicamente
  };
};
```

### Cache e Persistência

```typescript
// Salvar cor seed
await AsyncStorage.setItem('@android_seed_color', color);

// Carregar cor salva
const saved = await AsyncStorage.getItem('@android_seed_color');
```

### Detecção de Suporte

```typescript
const supportsMaterialYou = () => {
  return Platform.OS === 'android' && Platform.Version >= 31;
};
```

## 📱 Compatibilidade

### Android
- **12+ (API 31+)**: Suporte completo ao Material You
- **8.1 - 11**: Tema estático com opção de cores manuais
- **< 8.1**: Tema padrão apenas

### iOS
- **Todas as versões**: Tema estático elegante
- **Indicação visual**: Usuário informado sobre limitações

### Web
- **Tema padrão**: Cores estáticas consistentes
- **Responsive**: Adapta-se ao tema do sistema

## 🔮 Próximos Passos

### Implementação Nativa Real

Para uma implementação completa, seria necessário:

1. **Módulo Nativo Android**:
```java
@ReactMethod
public void getWallpaperColors(Promise promise) {
    WallpaperManager wallpaperManager = WallpaperManager.getInstance(getReactApplicationContext());
    WallpaperColors colors = wallpaperManager.getWallpaperColors(WallpaperManager.FLAG_SYSTEM);
    // Extrair cores dominantes
}
```

2. **Biblioteca Material Color Utilities**:
```typescript
import { MaterialDynamicColors } from '@material/material-color-utilities';

const palette = MaterialDynamicColors.fromImageFile(wallpaperImage);
```

3. **Listeners de Mudança**:
```java
wallpaperManager.addOnColorsChangedListener(
    (colors, which) -> {
        // Notificar React Native sobre mudanças
    },
    handler
);
```

### Melhorias Futuras

1. **Cores Personalizadas**
   - Color picker nativo
   - Importação de imagens
   - Geração a partir de fotos

2. **Animações de Transição**
   - Smooth transitions entre temas
   - Animated.Value para cores
   - Shared element transitions

3. **Configurações Avançadas**
   - Intensidade das cores
   - Contraste personalizado
   - Esquemas de cores alternativos

## 📚 Referências

- [Material Design 3](https://m3.material.io/)
- [Material You](https://material.io/blog/announcing-material-you)
- [Android Dynamic Colors](https://developer.android.com/develop/ui/views/theming/dynamic-colors)
- [React Native Paper Theming](https://reactnativepaper.com/docs/guides/theming)

## 🤝 Contribuindo

Para contribuir com melhorias no sistema de temas:

1. **Testes**: Teste em diferentes versões do Android
2. **Performance**: Otimize operações de cor
3. **Acessibilidade**: Verifique contraste e legibilidade
4. **Documentação**: Mantenha este README atualizado

---

*Este sistema foi implementado seguindo as melhores práticas do Material Design 3 e React Native, proporcionando uma experiência visual moderna e personalizada para os usuários.*