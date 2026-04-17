import { Injectable } from '@angular/core';
import { Observable, of, switchMap, timer } from 'rxjs';
import { User, UserDraft } from '../models/user.model';

let sequenciaIdentificadorInterno = 0;

function gerarIdentificadorUnico(): string {
  const apiCrypto = globalThis.crypto;
  if (typeof apiCrypto?.randomUUID === 'function') {
    return `u-${apiCrypto.randomUUID()}`;
  }
  sequenciaIdentificadorInterno += 1;
  return `u-${Date.now().toString(36)}-${sequenciaIdentificadorInterno.toString(36)}`;
}

function normalizarRascunho(rascunho: UserDraft): Omit<User, 'id'> & { id?: string } {
  return {
    id: rascunho.id,
    nome: rascunho.nome.trim(),
    email: rascunho.email.trim().toLowerCase(),
    cpf: rascunho.cpf.replaceAll(/\D/g, ''),
    telefone: rascunho.telefone.replaceAll(/\D/g, ''),
    tipoTelefone: rascunho.tipoTelefone,
  };
}

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly usuariosEmMemoria: User[] = [
    {
      id: 'u-daniel-hehe',
      nome: 'Daniel Savio',
      email: 'daniel@gmail.com.br',
      cpf: '12345678901',
      telefone: '99999999999',
      tipoTelefone: 'CELULAR',
    },
  ];

  getAll(): Observable<User[]> {
    return timer(450).pipe(switchMap(() => of([...this.usuariosEmMemoria])));
  }

  save(rascunhoUsuario: UserDraft): Observable<User> {
    const dadosNormalizados = normalizarRascunho(rascunhoUsuario);

    return timer(350).pipe(
      switchMap(() => {
        if (dadosNormalizados.id) {
          const indiceUsuarioExistente = this.usuariosEmMemoria.findIndex(
            (usuarioCadastrado) => usuarioCadastrado.id === dadosNormalizados.id,
          );
          if (indiceUsuarioExistente !== -1) {
            const usuarioAtualizado: User = {
              id: dadosNormalizados.id,
              nome: dadosNormalizados.nome,
              email: dadosNormalizados.email,
              cpf: dadosNormalizados.cpf,
              telefone: dadosNormalizados.telefone,
              tipoTelefone: dadosNormalizados.tipoTelefone,
            };
            this.usuariosEmMemoria[indiceUsuarioExistente] = usuarioAtualizado;
            return of({ ...usuarioAtualizado });
          }
        }

        const usuarioNovo: User = {
          id: gerarIdentificadorUnico(),
          nome: dadosNormalizados.nome,
          email: dadosNormalizados.email,
          cpf: dadosNormalizados.cpf,
          telefone: dadosNormalizados.telefone,
          tipoTelefone: dadosNormalizados.tipoTelefone,
        };
        this.usuariosEmMemoria.push(usuarioNovo);
        return of({ ...usuarioNovo });
      }),
    );
  }
}
