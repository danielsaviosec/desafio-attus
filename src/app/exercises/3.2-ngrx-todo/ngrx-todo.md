# 3.2 NgRx — To-do

Tudo está em `todo-ngrx.feature.ts`: actions, reducer com estado tipado, selectors e o effect que chama `HttpClient` e despacha sucesso ou erro.
A URL do HTTP é fictícia; nos testes a resposta é mockada com `HttpTestingController`.
O feature é registrado em `app.config.ts` com `provideState` e `provideEffects`.

## Como validar localmente

```bash
npm run test:exercises
```
