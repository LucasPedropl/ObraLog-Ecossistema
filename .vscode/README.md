# VS Code Configuration

Esta pasta contém configurações do VS Code para o projeto ObraLog.

## Arquivos

### `launch.json`

Configurações de depuração:

- **Next.js: Debug Server-side** - Depura o servidor Next.js
- **Next.js: Debug Client-side** - Depura o cliente no Chrome
- **Next.js: Debug Full Stack** - Depura cliente e servidor juntos
- **Expo: Debug Mobile** - Depura o app mobile
- **Debug All Apps** - Inicia depuração de todos os apps

### `tasks.json`

Tarefas disponíveis:

- **Dev: All Apps** (default) - Inicia todos os apps em modo desenvolvimento
- **Dev: Web** - Inicia apenas o app web (Next.js)
- **Dev: Mobile** - Inicia apenas o app mobile (Expo)
- **Dev: React** - Inicia apenas o app React
- **Build: All** - Faz build de todos os apps
- **Build: Web** - Faz build apenas do app web
- **Lint: All** - Executa linting em todos os projetos
- **Format: All** - Formata código com Prettier
- **Install Dependencies** - Instala dependências
- **Clean & Reinstall** - Limpa e reinstala dependências

### `settings.json`

Configurações do editor:

- Formatação automática ao salvar
- ESLint fix ao salvar
- Configurações do TypeScript
- Suporte a TailwindCSS
- Exclusões de arquivos e busca

### `extensions.json`

Extensões recomendadas para o projeto.

### `react-typescript.code-snippets`

Snippets úteis para desenvolvimento:

- `rfc` - React Functional Component
- `npage` - Next.js Page
- `ncpage` - Next.js Client Page
- `nlayout` - Next.js Layout
- `ust` - useState Hook
- `uef` - useEffect Hook
- `hook` - Custom Hook
- `ctx` - React Context (Provider + Hook)
- `cn` - Tailwind className

## Como usar

### Executar tarefas

1. Pressione `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
2. Digite "Tasks: Run Task"
3. Selecione a tarefa desejada

Ou use o atalho: `Ctrl+Shift+B` para executar a tarefa de build padrão.

### Iniciar depuração

1. Vá para a aba "Run and Debug" (`Ctrl+Shift+D`)
2. Selecione a configuração desejada no dropdown
3. Pressione `F5` para iniciar

### Instalar extensões recomendadas

1. Vá para a aba Extensions (`Ctrl+Shift+X`)
2. Digite "@recommended" na busca
3. Instale as extensões listadas

### Usar snippets

1. Comece a digitar o prefixo do snippet (ex: `rfc`)
2. Pressione `Tab` ou `Enter` para expandir
3. Use `Tab` para navegar entre os campos editáveis
