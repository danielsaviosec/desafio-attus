import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { BuscarPessoaService } from './buscar-pessoa.service';

@Component({
  selector: 'app-buscar-pessoa-exercise',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [BuscarPessoaService],
  template: `
    <label for="buscar-pessoa">Buscar pessoa</label>
    <input
      id="buscar-pessoa"
      type="text"
      [formControl]="buscarControl"
      placeholder="Digite um nome"
    />

    <p *ngIf="loading$ | async" class="loading">Carregando...</p>

    <ul>
      <li *ngFor="let pessoa of resultados$ | async">{{ pessoa }}</li>
    </ul>
  `,
})
export class BuscarPessoaComponent {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  readonly buscarControl = new FormControl('', { nonNullable: true });
  readonly loading$ = this.loadingSubject.asObservable();
  readonly resultados$: Observable<string[]> = this.buscarControl.valueChanges.pipe(
    startWith(this.buscarControl.value),
    map((busca: string) => busca.trim()),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((busca) => {
      if (!busca) {
        this.loadingSubject.next(false);
        return of([]);
      }

      this.loadingSubject.next(true);
      return this.buscarPessoaService.buscarPessoas(busca).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      );
    }),
  );
  constructor(private readonly buscarPessoaService: BuscarPessoaService) {}
}
