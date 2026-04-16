# 2.3 RxJS — busca com debounce

Foi implementado um campo de busca reativo com:

- `debounceTime(500)` para aguardar o usuário parar de digitar.
- `switchMap` para cancelar automaticamente a requisição anterior e evitar race condition.
- `loading$` para exibir indicador de carregamento enquanto a chamada está em andamento.
- `async` pipe no template para gerenciar subscription sem memory leak.

## Como validar localmente

```bash
npm run test:exercises
```
