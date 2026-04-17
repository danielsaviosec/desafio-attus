import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarrinhoItensComponent } from './carrinho-itens.component';

describe('Exercício 3.1 — Carrinho com Signals', () => {
  let fixture: ComponentFixture<CarrinhoItensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrinhoItensComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarrinhoItensComponent);
  });

  it('calcula o total como quantidade × preço', () => {
    fixture.componentInstance.adicionarItem({
      nome: 'Notebook',
      quantidade: 2,
      precoUnitario: 100,
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.total()).toBe(200);
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[data-testid="total"]')?.textContent,
    ).toContain('200');
  });

  it('emite totalChange sempre que o total mudar', () => {
    const emissoes: number[] = [];
    fixture.componentInstance.totalChange.subscribe((valor) => emissoes.push(valor));

    fixture.componentInstance.adicionarItem({
      nome: 'A',
      quantidade: 1,
      precoUnitario: 5,
    });
    fixture.componentInstance.adicionarItem({
      nome: 'B',
      quantidade: 2,
      precoUnitario: 3,
    });

    expect(emissoes).toEqual([5, 11]);
  });

  it('adicionarItemPadrao via template atualiza a lista', () => {
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement)
      .querySelector('[data-testid="btn-adicionar"]')
      ?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();
    expect(fixture.componentInstance.itens()).toHaveLength(1);
    expect(fixture.componentInstance.total()).toBe(10);
  });

  it('remove item e atualiza total', () => {
    fixture.componentInstance.adicionarItem({
      nome: 'X',
      quantidade: 1,
      precoUnitario: 10,
    });
    fixture.componentInstance.adicionarItem({
      nome: 'Y',
      quantidade: 1,
      precoUnitario: 5,
    });

    const idPrimeiro = fixture.componentInstance.itens()[0].id;
    fixture.componentInstance.removerItem(idPrimeiro);

    expect(fixture.componentInstance.total()).toBe(5);
  });
});
