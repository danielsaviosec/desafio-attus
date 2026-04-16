import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BuscarPessoaComponent } from './buscar-pessoa.component';
import { BuscarPessoaService } from './buscar-pessoa.service';

describe('Exercício 2.3 — RxJS busca com debounce', () => {
  let buscarPessoasMock: jest.MockedFunction<BuscarPessoaService['buscarPessoas']>;

  beforeEach(async () => {
    buscarPessoasMock = jest.fn((termo: string) => of([`Resultado ${termo}`]).pipe(delay(700)));

    await TestBed.configureTestingModule({
      imports: [BuscarPessoaComponent],
    })
      .overrideComponent(BuscarPessoaComponent, {
        set: {
          providers: [
            { provide: BuscarPessoaService, useValue: { buscarPessoas: buscarPessoasMock } },
          ],
        },
      })
      .compileComponents();
  });

  it('aguarda 500ms antes de buscar', fakeAsync(() => {
    const fixture = TestBed.createComponent(BuscarPessoaComponent);
    fixture.detectChanges();

    fixture.componentInstance.buscarControl.setValue('da');
    tick(499);
    expect(buscarPessoasMock).not.toHaveBeenCalled();

    tick(1);
    expect(buscarPessoasMock).toHaveBeenCalledWith('da');
    discardPeriodicTasks();
  }));

  it('exibe loading durante a requisição', fakeAsync(() => {
    const fixture = TestBed.createComponent(BuscarPessoaComponent);
    const element = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    fixture.componentInstance.buscarControl.setValue('maria');

    tick(500);
    fixture.detectChanges();
    expect(element.querySelector('.loading')?.textContent?.trim()).toBe('Carregando...');

    tick(700);
    fixture.detectChanges();
    expect(element.querySelector('.loading')).toBeNull();
    expect(element.querySelector('li')?.textContent?.trim()).toBe('Resultado maria');
    discardPeriodicTasks();
  }));

  it('cancela a requisição anterior quando o usuário digita novamente', fakeAsync(() => {
    buscarPessoasMock.mockImplementation((termo: string) =>
      of([`Resultado ${termo}`]).pipe(delay(termo === 'da' ? 1000 : 200)),
    );

    const fixture = TestBed.createComponent(BuscarPessoaComponent);
    const element = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    fixture.componentInstance.buscarControl.setValue('da');
    tick(500);

    fixture.componentInstance.buscarControl.setValue('dan');
    tick(500);

    tick(200);
    fixture.detectChanges();
    expect(element.querySelector('li')?.textContent?.trim()).toBe('Resultado dan');

    tick(1000);
    fixture.detectChanges();
    expect(element.querySelectorAll('li')).toHaveLength(1);
    expect(element.querySelector('li')?.textContent?.trim()).toBe('Resultado dan');
    discardPeriodicTasks();
  }));
});
