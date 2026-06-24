# Costura da Dorinha — Sistema de Controle de Pedidos

Aplicação fullstack criada para organizar os pedidos de costura da Dorinha 🧵. Registra serviços, calcula totais e exibe gráficos de faturamento mensal.

O projeto conta com:
- **Backend:** Node.js + Express + TypeScript + Prisma ORM + PostgreSQL
- **Frontend:** React + Next.js + TypeScript + Recharts
- **Infraestrutura:** PostgreSQL via Docker Compose

---

## Estrutura do Projeto

```text
dorinha-costura/
├── frontend/          # Next.js + React + Recharts
│   ├── src/           # Componentes, estilos e tipos
│   └── package.json
├── backend/           # Node.js + Express + Prisma
│   ├── src/           # Controladores, serviços e repositórios (DDD)
│   ├── prisma/        # Schema, migrações e seed
│   ├── Dockerfile
│   └── package.json
├── .env               # Variáveis de ambiente (não commitar)
├── .env.example       # Template das variáveis de ambiente
├── docker-compose.yml # PostgreSQL via Docker
├── package.json       # Monorepo workspaces (npm)
└── README.md
```

---

## Pré-requisitos

- **Node.js** v18 ou superior
- **npm** v9 ou superior
- **Docker** e **Docker Compose**

---

## 🚀 Primeira vez — Passo a passo completo

### 1. Clonar o repositório

```bash
git clone https://github.com/M0ria/dorinha-costura.git
cd dorinha-costura
```

### 2. Configurar as variáveis de ambiente

Copie o arquivo de exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

O `.env` já vem com as credenciais padrão prontas para uso local. Só altere se quiser usar um usuário/senha diferente.

### 3. Instalar as dependências

```bash
npm install
```

### 4. Subir o banco de dados

```bash
sudo docker-compose up -d db
```

Aguarde o container iniciar (leva alguns segundos). O PostgreSQL estará disponível em `localhost:5432`.

### 5. Executar as migrações

Cria as tabelas no banco de dados:

```bash
npm run prisma:migrate --workspace=backend
```

### 6. Popular o banco com dados de exemplo (seed)

```bash
npm run prisma:seed --workspace=backend
```

Isso insere 16 pedidos fictícios para que os gráficos e tabelas já mostrem dados ao abrir o sistema.

### 7. Subir o backend e o frontend

```bash
npm run dev
```

- **Frontend** → http://localhost:5173 (logs em verde `[frontend]`)
- **Backend**  → http://localhost:3001 (logs em azul `[backend]`)

---

## Uso no dia a dia

Após a primeira configuração, basta:

```bash
# 1. Garantir que o banco está rodando
sudo docker-compose up -d db

# 2. Subir tudo
npm run dev
```

### Rodar separadamente

```bash
# Apenas o backend (porta 3001)
npm run backend:dev

# Apenas o frontend (porta 5173)
npm run frontend:dev
```

### Modo produção (tudo no Docker)

```bash
sudo docker-compose --profile prod up -d --build
```

> ⚠️ Nesse modo o backend roda no container — não use `npm run dev` simultaneamente.

---

## Funcionalidades

O sistema é composto por 3 abas principais:

1. **Novo Pedido** — Formulário para registrar serviços (Ajuste, Confecção, Conserto, Reforma ou Outro), com cálculo automático de totais e campo de descrição condicional para serviços "Outro".
2. **Pedidos** — Cards de métricas (total de pedidos, faturamento e ticket médio) + listagem completa com badges por categoria e opção de exclusão.
3. **Análise** — Painel com três gráficos interativos (Recharts):
   - Frequência de pedidos por tipo
   - Faturamento por tipo de serviço
   - Evolução mensal de faturamento e quantidade de pedidos
