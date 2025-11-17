# App Facção

Sistema para gerenciamento de produção de costureiras autônomas e faccionistas.

## 📋 Sobre o Projeto

O App Facção é uma solução desenvolvida para auxiliar costureiras autônomas e faccionistas a gerenciar suas produções de forma simples e eficiente. O projeto está sendo desenvolvido como MVP (Minimum Viable Product) utilizando tecnologias modernas e focando na agilidade de desenvolvimento.

## 🚀 Tecnologias Utilizadas

### Frontend
- **[Vue 3](https://vuejs.org/)** - Framework JavaScript progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Vue Router 4](https://router.vuejs.org/)** - Roteamento oficial para Vue.js
- **[Pinia](https://pinia.vuejs.org/)** - Store de gerenciamento de estado para Vue
- **[PrimeVue 4](https://primevue.org/)** - Biblioteca de componentes UI ricos
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário (via tailwindcss-primeui)
- **[Axios](https://axios-http.com/)** - Cliente HTTP baseado em Promise
- **[Vuelidate](https://vuelidate-next.netlify.app/)** - Validação de formulários para Vue

### Backend/Database
- **[Supabase](https://supabase.com/)** - Backend as a Service (BaaS)
  - PostgreSQL Database
  - Authentication
  - Real-time subscriptions
  - Storage

## 🏗️ Arquitetura

O projeto segue uma arquitetura **multi-tenant**, onde:
- Cada usuário/cliente possui sua própria organização
- Todos os dados são armazenados em um único banco de dados
- Isolamento de dados é garantido através de chaves estrangeiras de organização
- Cada tabela possui referência à organização, garantindo que usuários vejam apenas seus próprios dados

### Estrutura de Tabelas

- `users` - Usuários do sistema
- `organization` - Organizações (tenants)
- `customer` - Clientes das organizações
- `lot` - Lotes de produção
- `type_service` - Tipos de serviços oferecidos
- `reference` - Referências de produtos

## 📁 Estrutura do Projeto

```
app_faccao/
├── public/                  # Arquivos estáticos
│   └── index.html
├── src/
│   ├── assets/              # Imagens, fontes, etc
│   ├── composables/         # Composables Vue (lógica reutilizável)
│   │   └── useAuth.ts       # Composable de autenticação
│   ├── global/              # Configurações e componentes globais
│   │   ├── components/      # Componentes globais
│   │   │   └── NavbarMenu.vue
│   │   └── supabase.ts      # Cliente Supabase (deprecated)
│   ├── pages/               # Páginas específicas de features
│   │   └── lot/             # Páginas relacionadas a lotes
│   │       ├── ListLot.vue
│   │       ├── SaveLot.vue
│   │       └── RemoveLot.vue
│   ├── router/              # Configuração de rotas
│   │   └── index.ts
│   ├── services/            # Serviços de comunicação com backend
│   │   ├── supabaseClient.ts  # Cliente Supabase configurado
│   │   ├── authService.ts     # Serviço de autenticação
│   │   └── lotService.ts      # Serviço de lotes
│   ├── stores/              # Pinia stores (gerenciamento de estado)
│   │   └── authStore.ts     # Store de autenticação
│   ├── types/               # Definições de tipos TypeScript
│   │   └── auth.types.ts    # Tipos de autenticação
│   ├── views/               # Views principais da aplicação
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   ├── LotView.vue
│   │   ├── CustomerView.vue
│   │   ├── ReferenceView.vue
│   │   ├── TypeServiceView.vue
│   │   └── OrganizationView.vue
│   ├── App.vue              # Componente raiz
│   ├── main.ts              # Entry point
│   └── shims-vue.d.ts       # Declarações TypeScript
├── .env                     # Variáveis de ambiente (não versionado)
├── .gitignore
├── bugs.md                  # Registro de bugs
├── CLAUDE.md                # Instruções para o Claude
├── package.json
├── tsconfig.json
├── vue.config.js
└── tailwind.config.js
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Conta no Supabase

### Instalação

1. Clone o repositório:
```bash
git clone git@github.com:kanyesteves/app_faccao.git
cd app_faccao
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto:
```env
VUE_APP_SUPABASE_URL=sua_url_do_supabase
VUE_APP_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Execute o projeto em modo de desenvolvimento:
```bash
npm run serve
```

A aplicação estará disponível em `http://localhost:8080`

## 📜 Scripts Disponíveis

```bash
# Servidor de desenvolvimento
npm run serve

# Build para produção
npm run build

# Lint e correção de código
npm run lint
```

## 🔐 Sistema de Autenticação

O projeto possui um sistema completo de autenticação integrado com Supabase:
- **Autenticação via Supabase Auth** - Login com email e senha
- **Persistência de sessão** - Sessão armazenada no localStorage que persiste após recarregar a página
- **Rotas protegidas** - Navegação controlada com `meta: { requiresAuth: true }`
- **Guards assíncronos** - Router guards que aguardam verificação de autenticação antes de permitir navegação
- **Auto-refresh de token** - Tokens de acesso renovados automaticamente
- **State management com Pinia** - Estado de autenticação centralizado e reativo
- **Redirecionamento inteligente** - Redirecionamento automático para login quando não autenticado

## 🚧 Status do Projeto

Em desenvolvimento - MVP

## ✅ Features Implementadas

- [x] **Autenticação com Supabase** - Sistema completo de login/logout
- [x] **Persistência de sessão** - Sessão mantida após F5/reload da página
- [x] **Navbar global** - Menu de navegação responsivo
- [x] **CRUD de Lotes** - Criar, listar, editar e remover lotes de produção
- [x] **Proteção de rotas** - Sistema de guards assíncronos para rotas protegidas
- [x] **Gerenciamento de estado** - Pinia store para autenticação

## 📝 Próximas Features

- [ ] Implementar CRUD completo de referências
- [ ] Implementar CRUD completo de tipos de serviços
- [ ] Implementar CRUD completo de clientes
- [ ] Tela de ajustes da organização
- [ ] Dashboard com métricas e indicadores de produção
- [ ] Sistema de relatórios
- [ ] Gestão de usuários da organização (multi-usuários por tenant)

## 👨‍💻 Autor

Kanydian Esteves

## 📄 Licença

Este projeto está sob a licença MIT.
