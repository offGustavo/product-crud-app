# Sistema de Variantes de Tema - Material Design 3

Este documento explica como funciona o novo sistema de variantes de tema implementado no aplicativo, que permite ao usuário escolher entre diferentes esquemas de cores (Teal, Azul, Roxo, Verde e Rosa).

## 🎨 Visão Geral

O sistema de variantes de tema oferece 5 esquemas de cores predefinidos, cada um seguindo as diretrizes do Material Design 3, com suporte automático para temas claro e escuro.

## 🌈 Temas Disponíveis

### 1. **Teal (Padrão)**
- **Cor principal**: #006A6B
- **Inspiração**: Oceano, tranquilidade
- **Ícone**: water

### 2. **Blue (Azul)**
- **Cor principal**: #1976D2
- **Inspiração**: Céu, confiança
- **Ícone**: water-drop

### 3. **Purple (Roxo)**
- **Cor principal**: #7B1FA2
- **Inspiração**: Criatividade, elegância
- **Ícone**: local-florist

### 4. **Green (Verde)**
- **Cor principal**: #388E3C
- **Inspiração**: Natureza, crescimento
- **Ícone**: eco

### 5. **Pink (Rosa)**
- **Cor principal**: #C2185B
- **Inspiração**: Energia, paixão
- **Ícone**: favorite

## 📁 Arquitetura do Sistema

### Arquivos Principais

#### `constants/theme.ts`
Contém todas as definições de cores para cada variante:
```typescript
export const ThemeVariants = {
  teal: { light: MD3Colors, dark: MD3ColorsDark, name: "Teal", icon: "water" },
  blue: { light: {...MD3Colors, ...BlueTheme}, dark: {...}, name: "Blue", icon: "water-drop" },
  // ... outras variantes
};
```

#### `hooks/useThemeVariant.ts`
Hook principal para gerenciamento de temas:
```typescript
const { currentTheme, colors, setThemeVariant, resetTheme } = useThemeVariant();
```

#### `components/ThemeVariantSelector.tsx`
Componente para seleção visual de temas:
- Interface intuitiva com círculos coloridos
- Preview instantâneo das cores
- Suporte a modo compacto

#### `components/ThemePreview.tsx`
Componente para visualização do tema atual:
- Mostra Primary, Secondary, Tertiary
- Demonstra componentes (botões, chips, superfícies)
- Valores hexadecimais das cores

## 🚀 Como Usar

### Implementação Básica
```typescript
import { useThemeVariant } from '../hooks/useThemeVariant';

const MyComponent = () => {
  const { colors, currentTheme } = useThemeVariant();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.onBackground }}>
        Tema atual: {currentTheme}
      </Text>
    </View>
  );
};
```

### Mudança de Tema
```typescript
const { setThemeVariant } = useThemeVariant();

// Trocar para tema azul
await setThemeVariant('blue');

// Resetar para padrão
await resetTheme();
```

### Seletor de Temas
```typescript
import ThemeVariantSelector from '../components/ThemeVariantSelector';

// Versão completa
<ThemeVariantSelector showTitle={true} compact={false} />

// Versão compacta
<ThemeVariantSelector showTitle={false} compact={true} />
```

## 🎯 Onde Encontrar

### Na Tela de Perfil
1. **Seção "App Theme"**: Seletor principal de temas
2. **Seção "Theme Preview"**: Visualização do tema atual
3. **Botão "Advanced Theme"**: Acesso às configurações avançadas

### Localização no Código
```
app/
├── (tabs)/
│   └── register.tsx          # Tela de perfil com seletores
├── _layout.tsx               # Integração principal
constants/
└── theme.ts                  # Definições de cores
hooks/
└── useThemeVariant.ts        # Lógica de gerenciamento
components/
├── ThemeVariantSelector.tsx  # Seletor de temas
└── ThemePreview.tsx         # Preview do tema
```

## ⚙️ Funcionalidades Técnicas

### Persistência
- **AsyncStorage**: Salva a escolha do usuário
- **Chave de armazenamento**: `@theme_variant`
- **Restauração**: Automática ao abrir o app

### Adaptação Automática
- **Tema escuro/claro**: Detecta configuração do sistema
- **Paletas dinâmicas**: Cada tema tem versões light/dark
- **Transições suaves**: Mudanças instantâneas

### Integração com React Native Paper
```typescript
// Layout principal
<PaperProvider theme={{
  colors: themeColors,
  roundness: 12,
  // ... outras configurações
}}>
```

### Geração de Cores
Cada tema segue a estrutura Material Design 3:
- **Primary**: Cor principal da marca
- **Secondary**: Cor complementar
- **Tertiary**: Cor de destaque
- **Containers**: Versões diluídas para fundos
- **On-colors**: Cores de texto sobre as principais

## 🎨 Paleta de Cores Completa

### Blue Theme (Light)
```typescript
primary: "#1976D2"
onPrimary: "#FFFFFF"
primaryContainer: "#BBDEFB"
onPrimaryContainer: "#0D47A1"
secondary: "#1565C0"
tertiary: "#42A5F5"
```

### Purple Theme (Light)
```typescript
primary: "#7B1FA2"
onPrimary: "#FFFFFF"
primaryContainer: "#E1BEE7"
onPrimaryContainer: "#4A148C"
secondary: "#8E24AA"
tertiary: "#AB47BC"
```

### Green Theme (Light)
```typescript
primary: "#388E3C"
onPrimary: "#FFFFFF"
primaryContainer: "#C8E6C9"
onPrimaryContainer: "#1B5E20"
secondary: "#4CAF50"
tertiary: "#66BB6A"
```

### Pink Theme (Light)
```typescript
primary: "#C2185B"
onPrimary: "#FFFFFF"
primaryContainer: "#F8BBD9"
onPrimaryContainer: "#880E4F"
secondary: "#E91E63"
tertiary: "#F06292"
```

## 🔧 API do Hook

### useThemeVariant()
```typescript
interface UseThemeVariantReturn {
  currentTheme: ThemeVariantKey;        // 'teal' | 'blue' | 'purple' | 'green' | 'pink'
  colors: typeof MD3Colors;             // Paleta de cores atual
  isDark: boolean;                      // Se está no modo escuro
  setThemeVariant: (variant) => void;   // Mudar tema
  resetTheme: () => void;               // Voltar ao padrão
  isLoading: boolean;                   // Estado de carregamento
}
```

## 🎭 Componentes Visuais

### ThemeVariantSelector
**Props:**
- `showTitle?: boolean` - Mostrar título "Choose Theme Color"
- `compact?: boolean` - Versão compacta para espaços menores

**Recursos:**
- Círculos coloridos com ícones
- Indicador de seleção (check)
- Preview das cores primary/secondary/tertiary
- Responsivo e acessível

### ThemePreview
**Props:**
- `showTitle?: boolean` - Mostrar cabeçalho com nome do tema
- `compact?: boolean` - Versão resumida

**Recursos:**
- Cards com cores primary/secondary/tertiary
- Valores hexadecimais das cores
- Demonstração de componentes (botões, chips)
- Exemplo de surface com elevação

## 📱 Experiência do Usuário

### Fluxo de Uso
1. **Acesso**: Perfil → Seção "App Theme"
2. **Seleção**: Toque no círculo da cor desejada
3. **Preview**: Visualização imediata das mudanças
4. **Confirmação**: Tema aplicado automaticamente
5. **Persistência**: Configuração salva para próximas sessões

### Estados Visuais
- **Tema selecionado**: Borda destacada + ícone de check
- **Preview em tempo real**: Cores se aplicam instantaneamente
- **Loading states**: Indicadores durante carregamento
- **Feedback visual**: Animações suaves de transição

## 🚀 Benefícios

### Para o Usuário
- **Personalização**: Escolha entre 5 temas únicos
- **Consistência**: Design harmonioso em todo o app
- **Acessibilidade**: Contrastes otimizados
- **Preferência**: Configuração lembrada

### Para o Desenvolvimento
- **Type Safety**: TypeScript completo
- **Manutenibilidade**: Código organizado e documentado
- **Extensibilidade**: Fácil adição de novos temas
- **Performance**: Cache eficiente e loading otimizado

## 🔮 Futuras Melhorias

### Recursos Planejados
1. **Temas customizados**: Color picker para cores próprias
2. **Sincronização**: Backup na nuvem das preferências
3. **Temas sazonais**: Esquemas especiais para datas comemorativas
4. **Modo automático**: Troca baseada em horário/localização
5. **Acessibilidade**: Alto contraste e daltonismo

### Extensões Possíveis
- Gradientes nas cores
- Temas baseados em imagens
- Paletas geradas por IA
- Temas colaborativos da comunidade

---

*Este sistema foi desenvolvido seguindo as melhores práticas do Material Design 3, proporcionando uma experiência de personalização rica e intuitiva para os usuários.*