# 2.4 Performance — OnPush e trackBy

## Por que usar `trackBy` melhora a performance

Em listas grandes, sem uma chave de identidade, o Angular tende a recriar mais elementos de DOM do que o necessario quando a colecao muda (insercao, remocao, reorder).

Com `@for` (ou `*ngFor`) usando uma chave estavel (`id`), o Angular entende quais itens sao os mesmos entre renderizacoes e reaproveita os nos existentes, reduzindo:

- criacao/destruicao de elementos;
- recalculo de estilos/layout;
- custo de update visual em listas com centenas de itens.

Implementacao correta (Angular 17 com `@for`):

```html
@for (usuario of usuarios; track usuario.id) {
<li>{{ usuario.nome }}</li>
}
```

## Como o `ChangeDetectionStrategy.OnPush` ajuda neste cenario

Com `OnPush`, o componente nao entra em deteccao de mudancas a cada ciclo global do Angular. Ele so verifica quando ha gatilho relevante, por exemplo:

- mudanca de referencia em `@Input`;
- evento no proprio componente (click, input etc.);
- emissao observada por `async` pipe;
- chamada manual de `markForCheck`.

Para lista grande, isso evita verificacoes desnecessarias em toda interacao da aplicacao. Em conjunto com `track`, o custo cai tanto na deteccao quanto na reconciliacao do DOM.

## Impacto de usar estrategia `Default` neste caso

Com `Default`, qualquer evento assincrono (timers, requisicoes, eventos de UI) pode disparar checks mais amplos, fazendo o Angular avaliar o componente com mais frequencia.

Em listas extensas, isso aumenta:

- quantidade de ciclos de deteccao;
- trabalho de comparacao/renderizacao;
- risco de queda de FPS e atraso de interacao em maquinas mais modestas.

Resultado: a tela continua funcionando, mas com pior eficiencia e menor previsibilidade de performance sob carga.
