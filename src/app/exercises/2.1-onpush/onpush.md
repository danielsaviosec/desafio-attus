# 2.1 Change Detection e OnPush

Implemente uma função genérica filtrarEPaginar&lt;T&gt; que recebe um array, um predicado de filtro e parâmetros de paginação (página e tamanho). A função deve retornar os itens da página atual e o total de registros filtrados. Use tipagem completa — sem any.

## Exemplo de uso

Imagine que você está montando uma página e só quer encaixar o componente do exercício no template, tipo:

```html
<app-pessoa-onpush-exercise />
```

Ao carregar, o `<h1>` começa vazio — o `PessoaService` finge uma API e demora uns 500 ms para devolver a pessoa. Quando o observable emite, o componente monta o texto (`Nome: …`) e aí entra o detalhe do OnPush: sem o gatilho certo de detecção de mudanças, você fica olhando para a tela e o nome não aparece mesmo com os dados já no componente.

Fora isso, tem um `setInterval` rodando em segundo plano incrementando um contador; nos testes isso aparece com `tick(1000)` para simular o tempo passando.

## Como validar localmente

rode:

```bash
npm run test:exercises
```
