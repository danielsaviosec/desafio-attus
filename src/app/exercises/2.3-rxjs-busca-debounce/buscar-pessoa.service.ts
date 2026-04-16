import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class BuscarPessoaService {
  private readonly pessoas = [
    'Daniel Savio',
    'Isabelle Costa',
    'Domingos Secundino',
    'Mauricia Lima',
  ];

  buscarPessoas(busca: string): Observable<string[]> {
    const normalizado = busca.trim().toLowerCase();
    const pessoasFiltradas = this.pessoas.filter((pessoa) =>
      pessoa.toLowerCase().includes(normalizado),
    );

    return of(pessoasFiltradas).pipe(delay(700));
  }
}
