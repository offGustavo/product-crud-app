## Descrição do Projeto

Este aplicativo mobile foi desenvolvido como Trabalho Final da disciplina de Desenvolvimento de Aplicativos Mobile. O projeto implementa um CRUD completo (Create, Read, Update, Delete) com dados simulados/reais, seguindo os requisitos técnicos e estruturais solicitados.

## Instruções de Execução

Siga os passos abaixo para configurar, compilar e executar o aplicativo em seu ambiente de desenvolvimento.
Pré-requisitos

Passos para Configuração
```bash
git clone https://github.com/offGustavo/product-crud-app ~/project/product-crud-app
```

```bash
cd ~/Projects/product-crud-app/

npx expo run
```

Agora você pode utilizar o seu smartphone com o [Expo Go](https://expo.dev/go) para testar a aplicação

### Testando o CRUD

Após a execução, o aplicativo abrirá na tela inicial. Navegue pelas telas para testar as funcionalidades:

-   Cadastrar (Create): Acesse a tela de cadastro, preencha os campos obrigatórios e salve.
-   Listar (Read): Na tela principal, visualize a lista de registros cadastrados.
-   Editar (Update): Toque em um item da lista para editar seus dados.
-   Excluir (Delete): Na tela de detalhes ou lista, use a opção de excluir para remover um registro.

Validações: Os campos obrigatórios são validados; tente salvar sem preencher para ver a mensagem de erro.
Estrutura do Projeto (Opcional)

Uma visão geral da organização do código:
text

```
product-crud-app/
├── app
│   ├── (tabs)
│   │   ├── _layout.tsx
│   │   ├── create.tsx
│   │   ├── edit.tsx
│   │   ├── index.tsx
│   │   └── register.tsx
│   ├── _layout.tsx
│   └── modal.tsx
├── app.json
├── assets
│   └── images
│       ├── android-icon-background.png
│       ├── android-icon-foreground.png
│       ├── android-icon-monochrome.png
│       ├── favicon.png
│       ├── icon.png
│       ├── partial-react-logo.png
│       ├── react-logo.png
│       ├── react-logo@2x.png
│       ├── react-logo@3x.png
│       └── splash-icon.png
├── components
│   ├── DynamicColorIndicator.tsx
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── LoadingSpinner.tsx
│   ├── parallax-scroll-view.tsx
│   ├── ProductForm.tsx
│   ├── ProductList.tsx
│   ├── theme
│   │   └── ThemeProvider.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── ThemePreview.tsx
│   ├── ThemeSettings.tsx
│   ├── ThemeTestIndicator.tsx
│   ├── ThemeVariantSelector.tsx
│   ├── ui
│   │   ├── collapsible.tsx
│   │   ├── icon-symbol.ios.tsx
│   │   └── icon-symbol.tsx
│   └── UserForm.tsx
├── constants
│   ├── theme-examples.md
│   └── theme.ts
├── contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── database
│   ├── index.ts
│   ├── operations.ts
│   └── schema.sql
├── DYNAMIC_THEME_README.md
├── eslint.config.js
├── hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   ├── use-theme-color.ts
│   ├── useAndroidColors.ts
│   ├── useDatabase.ts
│   ├── useDynamicColors.ts
│   ├── useSystemTheme.ts
│   └── useThemeVariant.ts
├── package-lock.json
├── package.json
├── README.md
├── scripts
│   └── reset-project.js
├── SISTEMA_LOGIN.md
├── THEME_VARIANTS_README.md
├── tsconfig.json
├── types
│   └── index.ts
└── utils
    └── validation.ts
```

## Funcionalidades Implementadas

-   ✅ Create: Cadastro de novos registros.
-   ✅ Read: Listagem e consulta de registros existentes.
-   ✅ Update: Edição de registros existentes.
-   ✅ Delete: Exclusão de registros com confirmação.
-   ✅ Validação de dados: Campos obrigatórios e formatos básicos.
-   ✅ Navegação entre telas: Fluxo intuitivo e coerente.
-   ✅ Persistência de dados: Armazenamento local com SqLite.
