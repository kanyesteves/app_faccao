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
├── public/              # Arquivos estáticos
│   └── index.html
├── src/
│   ├── assets/          # Imagens, fontes, etc
│   ├── global/          # Configurações globais
│   │   └── supabase.ts  # Cliente Supabase
│   ├── router/          # Configuração de rotas
│   │   └── index.ts
│   ├── system/          # Componentes e lógica do sistema
│   ├── views/           # Páginas/Views da aplicação
│   │   ├── HomeView.vue
│   │   └── LoginView.vue
│   ├── App.vue          # Componente raiz
│   ├── main.ts          # Entry point
│   └── shims-vue.d.ts   # Declarações TypeScript
├── .env                 # Variáveis de ambiente (não versionado)
├── .gitignore
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

O projeto possui um sistema de autenticação básico:
- Rotas protegidas com `meta: { requiresAuth: true }`
- Autenticação via token armazenado no localStorage
- Redirecionamento automático para login quando não autenticado

## 🚧 Status do Projeto

Em desenvolvimento - MVP

## 📝 Próximas Features

- [ ] Implementar autenticação com Supabase
- [ ] Telas de cadastro de lotes
- [ ] Telas de cadastro de referências
- [ ] Telas de cadastro de tipos de serviços
- [ ] Telas de cadastro de clientes
- [ ] Telas de ajutes da organização
- [ ] Sistema de gerenciamento de lotes
- [ ] Dashboard com métricas e indicadores

## 👨‍💻 Autor

Kanydian Esteves

## 📄 Licença

Este projeto está sob a licença MIT.
