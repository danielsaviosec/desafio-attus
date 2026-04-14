# Desafio Attus - Boilerplate Angular 17

Projeto base em Angular 17 na raiz do repositório com:

- RxJS
- NgRx Store, Effects, DevTools e Signals
- Angular Material
- Testes unitários com Jest
- Integração com API REST (exemplo com JSONPlaceholder)
- Husky com bloqueio de commit sem cobertura minima de 90%

## Scripts

- `npm start`: sobe ambiente de desenvolvimento.
- `npm run build`: gera build de produção.
- `npm run lint`: executa lint com ESLint (Angular).
- `npm run lint:fix`: corrige problemas de lint automaticamente.
- `npm run format`: aplica Prettier no projeto.
- `npm test`: executa testes unitários.
- `npm run sonar:prepare`: gera cobertura para o Sonar.
- `npm run sonar:scan`: executa o scanner Sonar.

## Docker

- `docker compose up --build`: sobe o app em modo desenvolvimento na porta `4200`.
- `docker compose --profile main up --build app-main`: sobe build de produção com Nginx na porta `8080`.
- `docker compose down`: encerra os containers.

## Sonar

O projeto foi configurado com `sonar-project.properties` na raiz, usando:

- fontes em `src`
- testes `*.spec.ts`
- cobertura em `coverage/lcov.info` (Jest)

Antes do scan, rode `npm run sonar:prepare`.

## Estrutura principal

- `src/app/core/services/posts-api.service.ts`: cliente HTTP para API REST.
- `src/app/state/posts.store.ts`: gerenciamento de estado com Signal Store.
- `src/app/app.component.ts`: tela inicial com Angular Material consumindo o estado.
