import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PessoaOnPushExerciseComponent } from './pessoa-onpush.component';

describe('Exercício 2.1 — Change Detection e OnPush', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PessoaOnPushExerciseComponent],
    }).compileComponents();
  });

  it('após o delay, atualiza texto e marca o componente', fakeAsync(() => {
    const fixture = TestBed.createComponent(PessoaOnPushExerciseComponent);
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    expect(compiled.textContent?.trim()).toBe('');

    tick(500);

    expect(fixture.componentInstance.texto).toBe('Nome: Daniel Savio  ');
    fixture.detectChanges();
    expect(compiled.textContent?.trim()).toBe('Nome: Daniel Savio');
    discardPeriodicTasks();
  }));

  it('mantém setInterval atualizando contador', fakeAsync(() => {
    const fixture = TestBed.createComponent(PessoaOnPushExerciseComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.contador).toBe(0);
    tick(1000);
    expect(fixture.componentInstance.contador).toBe(1);
    discardPeriodicTasks();
  }));
});
