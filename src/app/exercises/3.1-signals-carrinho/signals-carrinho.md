# 3.1 Angular Signals — estado local (carrinho)

Foi implementado o componente `CarrinhoItensComponent` usando apenas **Signals** para o estado:

- `itens` — `signal` com a lista de linhas do carrinho (`nome`, `quantidade`, `precoUnitario`).
- `total` — `computed` que soma `quantidade × precoUnitario` de cada linha.
- `adicionarItem` / `removerItem` — atualizam o `signal` da lista e emitem `totalChange` quando o total muda.
- `totalChange` — `output<number>()` disparado após cada mutação que altera o total.

## Como validar localmente

```bash
npm run test:exercises
```
