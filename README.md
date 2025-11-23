# Noro App

Sistema para gerenciamento de produção de costureiras autônomas e faccionistas.

![Vue.js](https://img.shields.io/badge/Vue.js-3.2-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)
![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?logo=pwa)

## 📋 Sobre o Projeto

O Noro App é uma solução desenvolvida para auxiliar costureiras autônomas e faccionistas a gerenciar suas produções de forma simples e eficiente. O projeto está sendo desenvolvido como MVP (Minimum Viable Product) utilizando tecnologias modernas e focando na agilidade de desenvolvimento.

O aplicativo é uma **PWA (Progressive Web App)**, podendo ser instalado em dispositivos móveis e funcionar offline.

## 🚀 Tecnologias Utilizadas

### Frontend
- **[Vue 3](https://vuejs.org/)** - Framework JavaScript progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Vue Router 4](https://router.vuejs.org/)** - Roteamento oficial para Vue.js
- **[Pinia](https://pinia.vuejs.org/)** - Store de gerenciamento de estado para Vue
- **[PrimeVue 4](https://primevue.org/)** - Biblioteca de componentes UI ricos
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário (via tailwindcss-primeui)
- **[Chart.js](https://www.chartjs.org/)** - Gráficos interativos para o Dashboard
- **[Axios](https://axios-http.com/)** - Cliente HTTP baseado em Promise
- **[Vuelidate](https://vuelidate-next.netlify.app/)** - Validação de formulários para Vue

### Backend/Database
- **[Supabase](https://supabase.com/)** - Backend as a Service (BaaS)
  - PostgreSQL Database
  - Authentication
  - Real-time subscriptions
  - Storage

### PWA
- **@vue/cli-plugin-pwa** - Plugin PWA para Vue CLI
- **Workbox** - Caching e suporte offline
- **Service Worker** - Funcionamento offline e instalação em dispositivos

## 🏗️ Arquitetura

O projeto segue uma arquitetura **multi-tenant**, onde:
- Cada usuário/cliente possui sua própria organização
- Todos os dados são armazenados em um único banco de dados
- Isolamento de dados é garantido através de chaves estrangeiras de organização
- Cada tabela possui referência à organização, garantindo que usuários vejam apenas seus próprios dados

### Estrutura de Tabelas

- `users` - Usuários do sistema (gerenciado pelo Supabase Auth)
- `organization` - Organizações (tenants) - contém nome, email, CNPJ, plano e user_id
- `customer` - Clientes das organizações - contém nome e dia de fechamento
- `lot` - Lotes de produção - contém número do lote
- `type_service` - Tipos de serviços oferecidos - contém nome do serviço
- `reference` - Referências de produtos - contém código, nome, cor, quantidade, valor, tamanho, data estimada e relacionamentos com cliente, lote e tipo de serviço

## 📁 Estrutura do Projeto

```
app_faccao/
├── public/                  # Arquivos estáticos (PWA)
│   ├── index.html
│   ├── manifest.json        # Manifest PWA
│   └── img/icons/           # Ícones PWA (192x192, 512x512, maskable)
├── src/
│   ├── assets/              # Imagens, fontes, logo
│   ├── composables/         # Composables Vue (lógica reutilizável)
│   │   └── useAuth.ts       # Composable de autenticação
│   ├── global/              # Configurações e componentes globais
│   │   ├── components/      # Componentes globais
│   │   │   └── NavbarMenu.vue
│   │   └── supabase.ts      # Configuração global Supabase
│   ├── pages/               # Páginas específicas de features
│   │   ├── customer/        # Páginas de clientes
│   │   │   ├── ListCustomer.vue
│   │   │   ├── SaveCustomer.vue
│   │   │   └── RemoveCustomer.vue
│   │   ├── lot/             # Páginas de lotes
│   │   │   ├── ListLot.vue
│   │   │   ├── SaveLot.vue
│   │   │   └── RemoveLot.vue
│   │   ├── reference/       # Páginas de referências
│   │   │   ├── ListReference.vue
│   │   │   └── SaveReference.vue
│   │   └── type-service/    # Páginas de tipos de serviço
│   │       ├── ListTypeService.vue
│   │       ├── SaveTypeService.vue
│   │       └── RemoveTypeService.vue
│   ├── router/              # Configuração de rotas
│   │   └── index.ts
│   ├── services/            # Serviços de comunicação com backend
│   │   ├── supabaseClient.ts      # Cliente Supabase configurado
│   │   ├── authService.ts         # Serviço de autenticação
│   │   ├── customerService.ts     # Serviço de clientes
│   │   ├── dashboardService.ts    # Serviço de métricas do dashboard
│   │   ├── lotService.ts          # Serviço de lotes
│   │   ├── organizationService.ts # Serviço de organização
│   │   ├── referenceService.ts    # Serviço de referências
│   │   └── typeServiceService.ts  # Serviço de tipos de serviço
│   ├── stores/              # Pinia stores (gerenciamento de estado)
│   │   └── authStore.ts     # Store de autenticação
│   ├── types/               # Definições de tipos TypeScript
│   │   ├── auth.types.ts         # Tipos de autenticação
│   │   ├── customer.types.ts     # Tipos de clientes
│   │   ├── organization.types.ts # Tipos de organização
│   │   └── reference.types.ts    # Tipos de referências
│   ├── views/               # Views principais da aplicação
│   │   ├── HomeView.vue          # Dashboard com métricas e gráficos
│   │   ├── LoginView.vue
│   │   ├── LotView.vue
│   │   ├── CustomerView.vue
│   │   ├── ReferenceView.vue
│   │   ├── TypeServiceView.vue
│   │   ├── OrganizationView.vue
│   │   └── UserView.vue
│   ├── App.vue              # Componente raiz
│   ├── main.ts              # Entry point
│   ├── registerServiceWorker.ts  # Service Worker PWA
│   └── shims-vue.d.ts       # Declarações TypeScript
├── .env                     # Variáveis de ambiente (não versionado)
├── .gitignore
├── bugs.md                  # Registro de bugs
├── CLAUDE.md                # Instruções para o Claude
├── package.json
├── tsconfig.json
├── vue.config.js            # Configuração Vue CLI + PWA
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

### Autenticação
- [x] **Autenticação com Supabase** - Sistema completo de login/logout
- [x] **Persistência de sessão** - Sessão mantida após F5/reload da página
- [x] **Auto-refresh de token** - Tokens de acesso renovados automaticamente
- [x] **Proteção de rotas** - Sistema de guards assíncronos para rotas protegidas
- [x] **Gerenciamento de estado** - Pinia store para autenticação

### Dashboard
- [x] **Métricas em cards** - Referências em andamento, valor em produção, atrasadas e concluídas
- [x] **Gráfico de Pizza** - Referências por status
- [x] **Gráfico de Barras** - Top 5 clientes por valor
- [x] **Gráfico de Barras** - Produção por tipo de serviço
- [x] **Cálculo por período de fechamento** - Valor em produção calculado por cliente

### CRUDs Completos
- [x] **CRUD de Lotes** - Criar, listar, editar e remover lotes de produção
- [x] **CRUD de Clientes** - Criar, listar, editar e remover clientes (com início e dia de fechamento)
- [x] **CRUD de Tipos de Serviço** - Criar, listar, editar e remover tipos de serviços
- [x] **CRUD de Referências** - Criar, listar, editar e remover referências com:
  - Relacionamentos (cliente, lote, tipo de serviço)
  - Status (Em Andamento, Concluída, Cancelada) com tags coloridas
  - Campos: código, nome, cor, tamanho, quantidade, valor unitário/total, datas

### Interface
- [x] **Navbar global** - Menu de navegação lateral (Drawer) com Avatar do usuário
- [x] **Tela de Organização** - Visualizar e editar informações (nome, email, CNPJ, plano)
- [x] **Design responsivo** - Interface adaptada para desktop e mobile
- [x] **Toast notifications** - Feedback visual para ações do usuário
- [x] **Estados vazios** - Mensagens orientativas quando não há dados

### PWA (Progressive Web App)
- [x] **Service Worker** - Funcionamento offline com Workbox
- [x] **Manifest configurado** - Instalável em dispositivos móveis
- [x] **Ícones PWA** - Ícones para Android/iOS (192x192, 512x512, maskable)
- [x] **Cache inteligente** - NetworkFirst para requisições Supabase (24h)
- [x] **Logo oficial** - Noro App com identidade visual

### Arquitetura
- [x] **Sistema multi-tenant** - Isolamento completo de dados por organização

## 📝 Próximas Features

- [ ] Sistema de relatórios
- [ ] Gestão de usuários da organização (multi-usuários por tenant)
- [ ] Filtros e busca nas listagens
- [ ] Paginação para grandes volumes de dados
- [ ] Registro de novos usuários

## 👨‍💻 Autor

Kanydian Esteves

## 📄 Licença

Este projeto está sob a licença MIT.
