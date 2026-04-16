# 2.4 Performance — OnPush e trackBy

Foi implementado um exemplo de lista com:

- `track usuario.id` para o Angular reaproveitar os elementos de DOM dos itens que continuam sendo os mesmos.
- `ChangeDetectionStrategy.OnPush` para evitar ciclos de detecção de mudanças desnecessários.
- comparação implícita com a estratégia `Default`, que faria mais verificações e teria mais custo em listas grandes.

Na prática, `trackBy` melhora a performance porque evita recriar itens da lista sem necessidade, e `OnPush` ajuda porque o componente só é verificado quando existe um gatilho relevante. Já com `Default`, a lista seria reavaliada com muito mais frequência.

## Como validar localmente

```bash
npm run test:exercises
```
