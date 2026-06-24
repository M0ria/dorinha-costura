# Costura da Dorinha — Sistema de Controle de Pedidos

Este é um monorepo fullstack desenvolvido em TypeScript para gerenciar e analisar os pedidos da costureira.

O projeto conta com:
- **Backend:** Node.js + Express + TypeScript + Prisma ORM + PostgreSQL.
- **Frontend:** React + TypeScript + Vite + Recharts + CSS Puro (Visual de tons terrosos, limpo e acolhedor).
- **Infraestrutura:** PostgreSQL 15 e Backend orquestrados via Docker Compose.

---

## Estrutura do Projeto

```text
dorinha-costura/
├── frontend/          # React App + Vite
│   ├── src/           # Componentes, estilos e tipos
│   └── package.json
├── backend/           # Node.js + Express + Prisma
│   ├── src/           # Controladores e inicialização
│   ├── prisma/        # Schemas, migrações e scripts de seed
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml # PostgreSQL + Backend Docker setup
├── package.json       # Monorepo workspaces
└── README.md
```

---

## Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 18 ou superior)
- **npm** (versão 9 ou superior)
- **Docker** e **Docker Compose**

---

## Como Rodar o Projeto

### 1. Iniciar o Banco de Dados (Docker)

No diretório raiz (`dorinha-costura/`), suba **apenas o banco de dados** PostgreSQL:

```bash
sudo docker-compose up -d db
```

*Nota: Dependendo da configuração do seu sistema operacional, pode ser necessário executar o comando com `sudo`:*

```bash
sudo docker-compose up -d --build
```

Ao subir pela primeira vez:
- O banco de dados PostgreSQL estará acessível na porta `5432`.
- O backend e o frontend rodam **localmente** (ver próximo passo).

> **Modo produção** (tudo no Docker): use `sudo docker-compose --profile prod up -d --build`.
> Nesse modo o backend roda no container e **não** use `npm run dev` simultaneamente.

### 2. Iniciar Backend e Frontend

Com o banco rodando, suba os dois servidores locais de uma só vez na raiz do monorepo:

```bash
npm run dev
```

- **Backend** → http://localhost:3001 (logs em azul `[backend]`)
- **Frontend** → http://localhost:5173 (logs em verde `[frontend]`)

Na **primeira execução**, popule o banco de dados com os pedidos de exemplo:

```bash
npm run prisma:seed --workspace=backend
```

---

## Funcionalidades do Sistema

O sistema é composto por 3 abas principais:

1. **Novo pedido:** Formulário com validações integradas para registrar novos pedidos (calculando custos de material, mão de obra e total automaticamente). Apresenta um campo de descrição condicional para tipos de serviço classificados como "Outro". Ao salvar, exibe um Toast de confirmação e atualiza as listagens.
2. **Pedidos:** Cards de métricas superiores (Total de pedidos, Faturamento e Ticket médio) seguidos por uma listagem de todos os pedidos cadastrados, acompanhados de badges estilizados por categoria e opção de exclusão.
3. **Análise:** Painel com o faturamento e estatísticas do negócio com três gráficos interativos (feitos com a biblioteca Recharts):
   - Frequência de pedidos por tipo.
   - Faturamento por tipo de serviço.
   - Evolução mensal de faturamento e quantidade de pedidos.

---

## Desenvolvimento Local (Sem Docker)

Se desejar executar o projeto localmente sem Docker (requer um PostgreSQL local rodando na porta 5432):

1. Crie um arquivo `backend/.env` e insira a string de conexão apropriada:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/dorinha_costura?schema=public"
   PORT=3001
   ```
2. Instale as dependências na raiz: `npm install`
3. Execute as migrações: `npm run prisma:migrate --workspace=backend`
4. Popule o banco: `npm run prisma:seed --workspace=backend`

### Rodar tudo de uma vez

Para subir **backend e frontend simultaneamente** em um único terminal com logs coloridos:

```bash
npm run dev
```

> O terminal exibirá os logs do backend com prefixo azul `[backend]` e do frontend com prefixo verde `[frontend]`.

### Rodar separadamente

```bash
# Apenas o backend (porta 3001)
npm run backend:dev

# Apenas o frontend (porta 5173)
npm run frontend:dev
```
