import { TestBed } from '@angular/core/testing';
import { PerformanceComponent } from './performance.component';

describe('Exercício 2.4 — Performance com OnPush e trackBy', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceComponent],
    }).compileComponents();
  });

  it('reaproveita o mesmo nó de DOM quando o item mantém o mesmo id', () => {
    const fixture = TestBed.createComponent(PerformanceComponent);
    fixture.detectChanges();

    const itensAntes = Array.from(
      fixture.nativeElement.querySelectorAll(
        '[data-testid="usuario-item"]',
      ) as NodeListOf<HTMLElement>,
    );
    const elementoDanielSavioAntes = itensAntes.find((elemento) =>
      elemento.textContent?.includes('1 - Daniel Savio'),
    );

    fixture.componentInstance.prependUsuario({ id: 99, nome: 'Novo usuário' });
    fixture.detectChanges();

    const itensDepois = Array.from(
      fixture.nativeElement.querySelectorAll(
        '[data-testid="usuario-item"]',
      ) as NodeListOf<HTMLElement>,
    );
    const elementoDanielSavioDepois = itensDepois.find((elemento) =>
      elemento.textContent?.includes('1 - Daniel Savio'),
    );

    expect(elementoDanielSavioAntes).toBeTruthy();
    expect(elementoDanielSavioDepois).toBeTruthy();
    expect(elementoDanielSavioDepois).toBe(elementoDanielSavioAntes);
  });

  it('preserva nós quando a lista é recriada com os mesmos ids', () => {
    const fixture = TestBed.createComponent(PerformanceComponent);
    fixture.detectChanges();

    const itensAntes = Array.from(
      fixture.nativeElement.querySelectorAll(
        '[data-testid="usuario-item"]',
      ) as NodeListOf<HTMLElement>,
    );

    fixture.componentInstance.substituirListaComMesmosIds();
    fixture.detectChanges();

    const itensDepois = Array.from(
      fixture.nativeElement.querySelectorAll(
        '[data-testid="usuario-item"]',
      ) as NodeListOf<HTMLElement>,
    );

    expect(itensDepois).toHaveLength(itensAntes.length);
    expect(itensDepois[0]).toBe(itensAntes[0]);
    expect(itensDepois[1]).toBe(itensAntes[1]);
    expect(itensDepois[2]).toBe(itensAntes[2]);
  });
});
