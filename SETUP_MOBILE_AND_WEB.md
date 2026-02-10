# 🚀 ObraLog Monorepo - Setup Mobile & Web

Repositório estruturado com **TurboRepo**, **pnpm**, **TypeScript** e **monorepo
com shared packages**.

## 📁 Estrutura do Projeto

```
ObraLog/
├── apps/
│   ├── Otrack2-web/          # App Web (React + Vite + TailwindCSS)
│   └── Otrack2-mobile/       # App Mobile (React Native + Expo)
├── packages/
│   ├── tsconfig/             # Configs TypeScript compartilhadas
│   ├── shared-types/         # Types compartilhados (User, InventoryItem, etc)
│   └── shared-services/      # Services Firebase compartilhados
├── turbo.json
└── pnpm-workspace.yaml
```

## 📦 O que foi Importado

✅ **Repositório Otrack2** clonado e integrado como `Otrack2-web`  
✅ **React Native + Expo** criado em `Otrack2-mobile`  
✅ **Shared packages** criados para reutilização entre web e mobile

## 🛠️ INSTALAÇÃO NECESSÁRIA

### 1️⃣ **Instalar Node.js e pnpm** (se ainda não tiver)

```bash
# Node.js 18+ recomendado
# Download: https://nodejs.org/

# Instalar pnpm globalmente
npm install -g pnpm
```

### 2️⃣ **Instalar Dependências do Monorepo**

```bash
cd c:\codigo\geplano\ObraLog
pnpm install
```

Isso vai instalar:

- Dependências do workspace
- Shared packages (`@obralog/shared-types`, `@obralog/shared-services`)
- Todas as apps (web e mobile)

### 3️⃣ **Instalar Expo CLI** (para mobile)

```bash
pnpm add -g expo-cli
```

### 4️⃣ **Configurar Ambiente** (Opcional)

Se quiser usar variáveis de ambiente:

```bash
# Criar arquivo .env na raiz
echo "VITE_FIREBASE_CONFIG=..." > .env
```

## 🚀 Como Rodar

### **Web (Vite)**

```bash
cd apps/Otrack2-web
pnpm dev
# Abre em http://localhost:5173
```

### **Mobile (Expo)**

```bash
cd apps/Otrack2-mobile
pnpm dev
# Abre Expo Metro Bundler
# Pressione 'w' para web, 'a' para Android, 'i' para iOS
```

### **Rodar Monorepo Inteiro**

```bash
pnpm dev
# Executa scripts "dev" de todos os apps em paralelo
```

## 🏗️ Build & Type Check

```bash
# Build todas as apps
pnpm build

# Type check em todos os packages
pnpm type-check

# Lint
pnpm lint

# Clean
pnpm clean
```

## 📚 Estrutura de Shared Packages

### **@obralog/shared-types**

Tipos reutilizáveis:

- `User`, `AccessProfile`, `InventoryItem`
- `ConstructionSite`, `MeasurementUnit`, `ItemCategory`
- `Theme`, `AuthState`

Uso:

```typescript
import { User, InventoryItem } from '@obralog/shared-types';
```

### **@obralog/shared-services**

Serviços Firebase reutilizáveis:

- `authService` - Login, Logout, getCurrentUser
- `inventoryService` - CRUD de itens
- Firebase config centralizado

Uso:

```typescript
import { authService, inventoryService } from '@obralog/shared-services';
```

## 🔧 Próximos Passos

1. **Build dos shared packages**

    ```bash
    pnpm build
    ```

2. **Testar se tudo está funcionando**

    ```bash
    pnpm type-check
    ```

3. **Começar desenvolvimento**
    - Web: `cd apps/Otrack2-web && pnpm dev`
    - Mobile: `cd apps/Otrack2-mobile && pnpm dev`

4. **Adaptar componentes web para mobile** (próximo cycle)

## 📱 Dependências Instaladas - Mobile

- **React Native 0.81.5** + **Expo 54**
- **React Navigation** (Bottom Tabs, Stack, Drawer)
- **Firebase 10** (Auth, Firestore)
- **NativeWind** (Tailwind para React Native)
- **Vector Icons** (Icones)
- **TypeScript 5.9**

## 🐛 Troubleshooting

### "Module not found: @obralog/..."

Certifique-se de que rodou:

```bash
pnpm install
pnpm build
```

### Porta 5173 já em uso

```bash
# Vite tentará alta porta automática, mas se não funcionar:
cd apps/Otrack2-web
pnpm dev -- --port 3000
```

### Erro no Expo

```bash
# Limpar cache
cd apps/Otrack2-mobile
rm -rf node_modules .expo
pnpm install
```

## 📖 Documentação Útil

- [TurboRepo](https://turbo.build/repo/docs)
- [pnpm workspaces](https://pnpm.io/workspaces)
- [Expo](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [Firebase](https://firebase.google.com/docs)

---

**Status**: ✅ Monorepo configurado e pronto para desenvolvimento!
