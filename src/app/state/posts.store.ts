import { inject } from '@angular/core';
import { EMPTY, catchError, finalize, pipe, switchMap, tap } from 'rxjs';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Post } from '../core/models/post.model';
import { PostsApiService } from '../core/services/posts-api.service';

interface PostsState {
  items: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  loading: false,
  error: null
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Erro ao carregar posts.';
}

export const PostsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, postsApi = inject(PostsApiService)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          postsApi.getPosts().pipe(
            tap((items) => patchState(store, { items })),
            catchError((error: unknown) => {
              patchState(store, { items: [], error: getErrorMessage(error) });
              return EMPTY;
            }),
            finalize(() => patchState(store, { loading: false }))
          )
        )
      )
    )
  }))
);
