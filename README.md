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
- `npm test`: executa testes unitários.

## Estrutura principal

- `src/app/core/services/posts-api.service.ts`: cliente HTTP para API REST.
- `src/app/state/posts.store.ts`: gerenciamento de estado com Signal Store.
- `src/app/app.component.ts`: tela inicial com Angular Material consumindo o estado.
