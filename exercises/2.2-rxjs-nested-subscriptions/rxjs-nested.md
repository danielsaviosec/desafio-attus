# 2.2 RxJS — eliminando subscriptions aninhadas

Refatore o código abaixo eliminando o subscribe dentro de subscribe. Use operadores RxJS
adequados, evite memory leaks e explique brevemente sua escolha de operador:

Troquei o subscribe aninhado por um único fluxo no `pipe`, com cuidado para não vazar subscription.

## Como validar localmente

```bash
npm run test:exercises
```
