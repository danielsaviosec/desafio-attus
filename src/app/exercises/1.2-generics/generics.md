# 1.2 Generics e tipos utilitários (TypeScript e qualidade de código)

Implementar uma função genérica `filtrarEPaginar<T>` que recebe um array, um predicado de filtro e parâmetros de paginação (página e tamanho). A função retorna os itens da página atual e o total de registros após o filtro, com tipagem completa -- sem `any`.

## Exemplo de uso

Um array de `Usuario` com filtro por nome (substring, case-insensitive) está em `generics.ts` (`usuariosFiltradosPorNome`), e os testes em `generics.spec.ts` cobrem o comportamento.

## Como validar localmente

rode:

```bash
npm run test:exercises
```
