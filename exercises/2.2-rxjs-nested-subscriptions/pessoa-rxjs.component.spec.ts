import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PessoaRxjsExerciseComponent } from './pessoa-rxjs.component';

describe('Exercício 2.2 — RxJS eliminando subscriptions aninhadas', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PessoaRxjsExerciseComponent],
    }).compileComponents();
  });

  it('monta texto após as duas chamadas em sequência', fakeAsync(() => {
    const fixture = TestBed.createComponent(PessoaRxjsExerciseComponent);
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    expect(compiled.textContent?.trim()).toBe('');

    tick(500);
    expect(fixture.componentInstance.texto).toBe('');

    tick(300);
    expect(fixture.componentInstance.texto).toBe('Nome: Daniel Savio | familiares: 4');

    fixture.detectChanges();
    expect(compiled.textContent?.trim()).toBe('Nome: Daniel Savio | familiares: 4');
    discardPeriodicTasks();
  }));
});
