import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { PessoaService } from './pessoa.service';

@Component({
  selector: 'app-pessoa-rxjs-exercise',
  standalone: true,
  template: `<h1>{{ texto }}</h1>`,
  providers: [PessoaService],
})
export class PessoaRxjsExerciseComponent implements OnInit {
  texto = '';
  private readonly pessoaService = inject(PessoaService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const pessoaId = 1;
    this.pessoaService
      .buscarPorId(pessoaId)
      .pipe(
        switchMap((pessoa) =>
          this.pessoaService
            .buscarQuantidadeFamiliares(pessoaId)
            .pipe(map((qtd) => ({ pessoa, qtd }))),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ pessoa, qtd }) => {
        this.texto = `Nome: ${pessoa.nome} | familiares: ${qtd}`;
      });
  }
}
