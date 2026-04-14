import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PessoaService } from './pessoa.service';

@Component({
  selector: 'app-pessoa-onpush-exercise',
  standalone: true,
  template: `<h1>{{ texto }}</h1>`,
  providers: [PessoaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PessoaOnPushExerciseComponent implements OnInit, OnDestroy {
  texto = '';
  contador = 0;
  subscriptionBuscarPessoa?: Subscription;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(
    private readonly pessoaService: PessoaService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subscriptionBuscarPessoa = this.pessoaService.buscarPorId(1).subscribe((pessoa) => {
      this.texto = `Nome: ${pessoa.nome}`;
      this.cdr.markForCheck();
    });
    this.intervalId = setInterval(() => this.contador++, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptionBuscarPessoa?.unsubscribe();
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }
}
