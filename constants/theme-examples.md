# Material Design 3 Theme Usage Examples

Este arquivo contém exemplos de como usar o tema Material Design 3 no projeto.

## Importando o Tema

```typescript
import { MD3Colors, MD3ColorsDark, Typography, Elevation, Shape, Spacing } from '../constants/theme';
import { useTheme } from 'react-native-paper';
```

## Usando Cores

### Cores Primárias
```typescript
const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.primary,        // #006A6B (teal principal)
      color: theme.colors.onPrimary,               // #FFFFFF (texto no primário)
    }}>
      <Text style={{ color: theme.colors.onPrimary }}>
        Texto Principal
      </Text>
    </View>
  );
};
```

### Cores de Superfície
```typescript
// Card elevado
<Card style={{
  backgroundColor: theme.colors.surfaceContainerLow,  // Superfície elevada
  ...Elevation.level1,                                // Sombra sutil
  borderRadius: Shape.medium,                         // Border radius 12dp
}}>
  <Text style={{ color: theme.colors.onSurface }}>
    Conteúdo do card
  </Text>
</Card>

// Card preenchido
<Card style={{
  backgroundColor: theme.colors.surfaceContainerHighest, // Superfície preenchida
  borderRadius: Shape.medium,
}}>
  <Text style={{ color: theme.colors.onSurface }}>
    Conteúdo do card preenchido
  </Text>
</Card>
```

## Tipografia

### Usando Escalas de Texto
```typescript
import { Typography } from '../constants/theme';

// Título grande
<Text style={[
  Typography.headlineLarge,
  { color: theme.colors.onSurface }
]}>
  Título Principal
</Text>

// Corpo do texto
<Text style={[
  Typography.bodyLarge,
  { color: theme.colors.onSurfaceVariant }
]}>
  Este é o texto do corpo principal com estilo Material Design 3.
</Text>

// Label pequeno
<Text style={[
  Typography.labelSmall,
  { color: theme.colors.onSurfaceVariant }
]}>
  LABEL PEQUENO
</Text>
```

## Botões

### Botão Principal (Filled)
```typescript
<Button
  mode="contained"
  style={{
    backgroundColor: theme.colors.primary,
    borderRadius: Shape.extraLarge,               // 28dp
    ...Elevation.level1,
  }}
  contentStyle={{ paddingVertical: 12 }}
  labelStyle={{
    color: theme.colors.onPrimary,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  }}
>
  Ação Principal
</Button>
```

### Botão Secundário (Outlined)
```typescript
<Button
  mode="outlined"
  style={{
    borderColor: theme.colors.outline,
    borderRadius: Shape.extraLarge,
  }}
  contentStyle={{ paddingVertical: 12 }}
  labelStyle={{
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  }}
>
  Ação Secundária
</Button>
```

### Botão Tonal
```typescript
<Button
  mode="contained"
  style={{
    backgroundColor: theme.colors.secondaryContainer,
    borderRadius: Shape.extraLarge,
  }}
  labelStyle={{
    color: theme.colors.onSecondaryContainer,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  }}
>
  Botão Tonal
</Button>
```

## Cards

### Card Elevado (Padrão)
```typescript
<Card style={[
  {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: Shape.medium,                    // 12dp
    margin: Spacing.md,                            // 16dp
  },
  Elevation.level1,                                // Sombra sutil
]}>
  <Card.Content style={{ padding: Spacing.lg }}>  {/* 24dp */}
    <Text style={[
      Typography.titleLarge,
      { color: theme.colors.onSurface }
    ]}>
      Título do Card
    </Text>
    <Text style={[
      Typography.bodyMedium,
      { 
        color: theme.colors.onSurfaceVariant,
        marginTop: Spacing.sm                      // 8dp
      }
    ]}>
      Descrição do conteúdo do card.
    </Text>
  </Card.Content>
</Card>
```

### Card com Contorno (Outlined)
```typescript
<Card style={{
  backgroundColor: theme.colors.surface,
  borderRadius: Shape.medium,
  borderWidth: 1,
  borderColor: theme.colors.outlineVariant,
  margin: Spacing.md,
}}>
  <Card.Content>
    {/* Conteúdo */}
  </Card.Content>
</Card>
```

## Inputs

### TextInput com Estilo MD3
```typescript
<TextInput
  label="Nome do Produto"
  mode="outlined"
  style={{
    backgroundColor: 'transparent',
    marginBottom: Spacing.lg,
  }}
  outlineStyle={{
    borderRadius: Shape.medium,                    // 12dp
    borderWidth: 1,
  }}
  contentStyle={{
    fontSize: 16,
    fontFamily: 'Roboto',
  }}
  theme={{
    colors: {
      primary: theme.colors.primary,
      outline: theme.colors.outline,
      onSurfaceVariant: theme.colors.onSurfaceVariant,
    }
  }}
/>
```

## Estados de Cores

### Success (Sucesso)
```typescript
<View style={{
  backgroundColor: theme.colors.successContainer,
  padding: Spacing.md,
  borderRadius: Shape.medium,
}}>
  <Text style={{ color: theme.colors.onSuccessContainer }}>
    Operação realizada com sucesso!
  </Text>
</View>
```

### Warning (Aviso)
```typescript
<View style={{
  backgroundColor: theme.colors.warningContainer,
  padding: Spacing.md,
  borderRadius: Shape.medium,
}}>
  <Text style={{ color: theme.colors.onWarningContainer }}>
    Atenção: Verifique os dados inseridos.
  </Text>
</View>
```

### Error (Erro)
```typescript
<View style={{
  backgroundColor: theme.colors.errorContainer,
  padding: Spacing.md,
  borderRadius: Shape.medium,
}}>
  <Text style={{ color: theme.colors.onErrorContainer }}>
    Erro: Não foi possível completar a operação.
  </Text>
</View>
```

## Navegação

### Tab Bar Personalizada
```typescript
tabBarStyle: {
  backgroundColor: theme.colors.surface,
  borderTopWidth: 0,
  elevation: Elevation.level2.elevation,
  height: 80,
  paddingBottom: 16,
  paddingTop: 12,
},
tabBarLabelStyle: [
  Typography.labelMedium,
  { color: theme.colors.onSurfaceVariant }
],
tabBarActiveTintColor: theme.colors.primary,
tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
```

## Componentes Personalizados

### Chip de Status
```typescript
const StatusChip = ({ status, children }) => {
  const getStatusColors = () => {
    switch (status) {
      case 'active':
        return {
          background: theme.colors.successContainer,
          text: theme.colors.onSuccessContainer,
        };
      case 'inactive':
        return {
          background: theme.colors.errorContainer,
          text: theme.colors.onErrorContainer,
        };
      default:
        return {
          background: theme.colors.surfaceVariant,
          text: theme.colors.onSurfaceVariant,
        };
    }
  };

  const colors = getStatusColors();

  return (
    <View style={{
      backgroundColor: colors.background,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: Shape.small,                   // 8dp
    }}>
      <Text style={[
        Typography.labelSmall,
        { color: colors.text }
      ]}>
        {children}
      </Text>
    </View>
  );
};
```

### FAB (Floating Action Button)
```typescript
<FAB
  icon="plus"
  style={{
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: Shape.large,                     // 16dp
    ...Elevation.level3,
  }}
  color={theme.colors.onPrimaryContainer}
  onPress={() => {}}
/>
```

## Responsividade e Adaptação

### Verificação de Tema Escuro
```typescript
import { useColorScheme } from 'react-native';

const MyComponent = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? MD3ColorsDark : MD3Colors;
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      {/* Conteúdo que se adapta ao tema */}
    </View>
  );
};
```

### Criando Variações de Componentes
```typescript
const createButtonVariant = (variant: 'primary' | 'secondary' | 'tertiary') => {
  const baseStyle = {
    borderRadius: Shape.extraLarge,
    paddingVertical: 12,
    paddingHorizontal: 24,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: theme.colors.primary,
        color: theme.colors.onPrimary,
        ...Elevation.level1,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: theme.colors.secondaryContainer,
        color: theme.colors.onSecondaryContainer,
      };
    case 'tertiary':
      return {
        ...baseStyle,
        backgroundColor: theme.colors.tertiaryContainer,
        color: theme.colors.onTertiaryContainer,
      };
  }
};
```

## Boas Práticas

1. **Use sempre as cores semânticas**: Prefira `theme.colors.primary` ao invés de cores hardcoded
2. **Respeite a hierarquia tipográfica**: Use as escalas de Typography para manter consistência
3. **Aplique elevações apropriadas**: Use Elevation.level1-5 conforme a importância do elemento
4. **Mantenha o espaçamento consistente**: Use o sistema de Spacing (8dp grid)
5. **Teste em ambos os temas**: Sempre verifique como fica no modo claro e escuro
6. **Use border radius apropriados**: Siga o sistema Shape para manter a linguagem visual

## Tokens Personalizados

Se precisar criar tokens personalizados, siga o padrão:

```typescript
export const CustomTokens = {
  colors: {
    brand: '#006A6B',
    onBrand: '#FFFFFF',
    brandContainer: '#9FF2F3',
    onBrandContainer: '#002020',
  },
  spacing: {
    micro: 2,
    tiny: 6,
    huge: 80,
  },
  typography: {
    customHeadline: {
      fontSize: 20,
      fontWeight: '600',
      letterSpacing: 0.15,
      lineHeight: 26,
    },
  },
};
```
