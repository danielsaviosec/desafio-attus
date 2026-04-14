import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class PessoaService {
  buscarPorId(id: number) {
    return of({ id, nome: 'Daniel Savio' }).pipe(delay(500));
  }

  buscarQuantidadeFamiliares(pessoaId: number) {
    return of(pessoaId === 1 ? 4 : 0).pipe(delay(300));
  }
}
