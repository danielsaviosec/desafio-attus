import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export const TODO_HTTP_MOCK_URL = 'https://api.exemplo.local/todos';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const loadTodos = createAction('[Todo] Load Todos');

export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>(),
);

export const loadTodosError = createAction('[Todo] Load Todos Error', props<{ error: string }>());

export const toggleTodoComplete = createAction(
  '[Todo] Toggle Todo Complete',
  props<{ id: number }>(),
);

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export const initialTodoState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

export const todoReducer = createReducer(
  initialTodoState,
  on(
    loadTodos,
    (state): TodoState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    loadTodosSuccess,
    (state, { todos }): TodoState => ({
      ...state,
      todos,
      loading: false,
      error: null,
    }),
  ),
  on(
    loadTodosError,
    (state, { error }): TodoState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
  on(
    toggleTodoComplete,
    (state, { id }): TodoState => ({
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    }),
  ),
);

export const TODO_FEATURE_KEY = 'todo';

export const selectTodoState = createFeatureSelector<TodoState>(TODO_FEATURE_KEY);

export const selectAllTodos = createSelector(selectTodoState, (state) => state.todos);

export const selectPendingTodos = createSelector(selectAllTodos, (todos) =>
  todos.filter((todo) => !todo.completed),
);

type RespostaHttpTodo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

@Injectable()
export class TodoEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  readonly loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTodos),
      switchMap(() =>
        this.http.get<RespostaHttpTodo[]>(TODO_HTTP_MOCK_URL).pipe(
          map((resposta) =>
            loadTodosSuccess({
              todos: resposta.map(
                (item): Todo => ({
                  id: item.id,
                  title: item.title,
                  completed: item.completed,
                }),
              ),
            }),
          ),
          catchError(() => of(loadTodosError({ error: 'Falha ao carregar tarefas.' }))),
        ),
      ),
    ),
  );
}
