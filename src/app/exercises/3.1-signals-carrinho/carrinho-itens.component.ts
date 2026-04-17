import { Component, computed, output, signal } from '@angular/core';

export interface CarrinhoItem {
  id: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

@Component({
  selector: 'app-carrinho-itens-exercise',
  standalone: true,
  template: `
    <ul>
      @for (item of itens(); track item.id) {
        <li data-testid="linha-item">
          <span>{{ item.nome }}</span>
          <span data-testid="subtotal">{{ item.quantidade * item.precoUnitario }}</span>
          <button type="button" (click)="removerItem(item.id)">Remover</button>
        </li>
      }
    </ul>
    <p data-testid="total">{{ total() }}</p>
    <button type="button" data-testid="btn-adicionar" (click)="adicionarItemPadrao()">
      Adicionar item
    </button>
  `,
})
export class CarrinhoItensComponent {
  readonly itens = signal<CarrinhoItem[]>([]);

  readonly total = computed(() =>
    this.itens().reduce((acc, item) => acc + item.quantidade * item.precoUnitario, 0),
  );

  readonly totalChange = output<number>();

  private nextId = 0;

  adicionarItem(item: Omit<CarrinhoItem, 'id'>): void {
    const id = `item-${this.nextId++}`;
    this.itens.update((lista) => [...lista, { ...item, id }]);
    this.totalChange.emit(this.total());
  }

  adicionarItemPadrao(): void {
    this.adicionarItem({ nome: 'Item', quantidade: 1, precoUnitario: 10 });
  }

  removerItem(id: string): void {
    this.itens.update((lista) => lista.filter((i) => i.id !== id));
    this.totalChange.emit(this.total());
  }
}
