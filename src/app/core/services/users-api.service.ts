import { Injectable } from '@angular/core';
import { Observable, of, switchMap, timer } from 'rxjs';
import { PhoneType, User, UserDraft } from '../models/user.model';

function gerarIdentificadorUnico(): string {
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizarRascunho(rascunho: UserDraft): Omit<User, 'id'> & { id?: string } {
  return {
    id: rascunho.id,
    nome: rascunho.nome.trim(),
    email: rascunho.email.trim().toLowerCase(),
    cpf: rascunho.cpf.replace(/\D/g, ''),
    telefone: rascunho.telefone.replace(/\D/g, ''),
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
              tipoTelefone: dadosNormalizados.tipoTelefone as PhoneType,
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
          tipoTelefone: dadosNormalizados.tipoTelefone as PhoneType,
        };
        this.usuariosEmMemoria.push(usuarioNovo);
        return of({ ...usuarioNovo });
      }),
    );
  }
}
