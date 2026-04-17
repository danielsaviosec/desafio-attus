import { computed, inject } from '@angular/core';
import {
  EMPTY,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { User, UserDraft } from '../../core/models/user.model';
import { UsersApiService } from '../../core/services/users-api.service';

interface UsersState {
  items: User[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveError: string | null;
  nameFilter: string;
}

const estadoInicialUsuarios: UsersState = {
  items: [],
  loading: false,
  saving: false,
  error: null,
  saveError: null,
  nameFilter: '',
};

function mensagemAmigavelParaFalha(falha: unknown): string {
  if (falha instanceof Error) {
    return falha.message;
  }
  return 'Não foi possível completar a operação.';
}

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(estadoInicialUsuarios),
  withComputed(({ items: usuariosCadastrados, nameFilter: termoBuscaNome }) => ({
    filteredItems: computed(() => {
      const termoBuscaNormalizado = termoBuscaNome().trim().toLowerCase();
      if (!termoBuscaNormalizado) {
        return usuariosCadastrados();
      }
      return usuariosCadastrados().filter((usuario) =>
        usuario.nome.toLowerCase().includes(termoBuscaNormalizado),
      );
    }),
  })),
  withMethods((store, servicoUsuarios = inject(UsersApiService)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          servicoUsuarios.getAll().pipe(
            tap((listaRecebidaDaApi) => patchState(store, { items: listaRecebidaDaApi })),
            catchError((falhaDesconhecida: unknown) => {
              patchState(store, {
                items: [],
                error: mensagemAmigavelParaFalha(falhaDesconhecida),
              });
              return EMPTY;
            }),
            finalize(() => patchState(store, { loading: false })),
          ),
        ),
      ),
    ),

    setNameFilter: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((novoTermoBuscaNome) => patchState(store, { nameFilter: novoTermoBuscaNome })),
      ),
    ),

    save: rxMethod<UserDraft>(
      pipe(
        tap(() => patchState(store, { saving: true, saveError: null })),
        switchMap((rascunhoUsuario) =>
          servicoUsuarios.save(rascunhoUsuario).pipe(
            tap((usuarioSalvo) => {
              const listaAtual = store.items();
              const indiceUsuarioExistente = listaAtual.findIndex(
                (usuario) => usuario.id === usuarioSalvo.id,
              );
              const listaAtualizada =
                indiceUsuarioExistente === -1
                  ? [...listaAtual, usuarioSalvo]
                  : listaAtual.map((usuario, indice) =>
                      indice === indiceUsuarioExistente ? usuarioSalvo : usuario,
                    );
              patchState(store, { items: listaAtualizada });
            }),
            catchError((falhaDesconhecida: unknown) => {
              patchState(store, { saveError: mensagemAmigavelParaFalha(falhaDesconhecida) });
              return EMPTY;
            }),
            finalize(() => patchState(store, { saving: false })),
          ),
        ),
      ),
    ),
  })),
);
