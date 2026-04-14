import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class PessoaService {
  buscarPorId(id: number) {
    return of({ id, nome: 'Daniel Savio' }).pipe(delay(500));
  }
}
