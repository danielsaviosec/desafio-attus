# Desafio Attus — Listagem de usuários (Angular 17)

## Requisitos

- Node.js **18.13+** (recomendado **20 LTS**)
- npm 9+

## Instalação e execução

```bash
npm install
npm start
```

Abra `http://localhost:4200/` — a rota padrão redireciona para `/usuarios`.

Build de produção:

```bash
npm run build
```

## Testes

```bash
npm test
npm run test:coverage
```

O projeto usa **Jest** com limiar global de cobertura (branches, funções, linhas e statements).

## Scripts úteis

- `npm run lint` / `npm run lint:fix`: ESLint (Angular)
- `npm run format` / `npm run format:check`: Prettier
- `npm run sonar:prepare`: cobertura para o Sonar

## Docker

- `docker compose up --build`: ambiente de desenvolvimento na porta **4200**
- `docker compose --profile main up --build app-main`: build de produção com Nginx na porta **8080**
- `docker compose down`: encerra os containers

## Sonar

Configuração em `sonar-project.properties`. Antes do scan: `npm run sonar:prepare`.
