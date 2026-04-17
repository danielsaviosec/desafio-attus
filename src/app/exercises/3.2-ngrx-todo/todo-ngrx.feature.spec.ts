import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  TODO_HTTP_MOCK_URL,
  Todo,
  TodoEffects,
  initialTodoState,
  loadTodos,
  loadTodosError,
  loadTodosSuccess,
  selectAllTodos,
  selectPendingTodos,
  todoReducer,
  toggleTodoComplete,
} from './todo-ngrx.feature';

describe('Exercício 3.2 — NgRx To-do (feature em um único módulo)', () => {
  describe('reducer', () => {
    const amostra: Todo[] = [
      { id: 1, title: 'A', completed: false },
      { id: 2, title: 'B', completed: true },
    ];

    it('loadTodos ativa loading e limpa erro', () => {
      const estado = todoReducer({ ...initialTodoState, error: 'antigo' }, loadTodos());
      expect(estado.loading).toBe(true);
      expect(estado.error).toBeNull();
    });

    it('loadTodosSuccess preenche lista e desliga loading', () => {
      const estado = todoReducer(
        { ...initialTodoState, loading: true },
        loadTodosSuccess({ todos: amostra }),
      );
      expect(estado.loading).toBe(false);
      expect(estado.todos).toEqual(amostra);
    });

    it('loadTodosError guarda mensagem e desliga loading', () => {
      const estado = todoReducer(
        { ...initialTodoState, loading: true },
        loadTodosError({ error: 'falhou' }),
      );
      expect(estado.loading).toBe(false);
      expect(estado.error).toBe('falhou');
    });

    it('toggleTodoComplete alterna completed', () => {
      const estado = todoReducer(
        { ...initialTodoState, todos: amostra },
        toggleTodoComplete({ id: 1 }),
      );
      expect(estado.todos.find((t) => t.id === 1)?.completed).toBe(true);
      expect(estado.todos.find((t) => t.id === 2)?.completed).toBe(true);
    });
  });

  describe('selectors', () => {
    const todos: Todo[] = [
      { id: 1, title: 'Aberta', completed: false },
      { id: 2, title: 'Fechada', completed: true },
      { id: 3, title: 'Outra aberta', completed: false },
    ];

    const estadoSlice = {
      todos,
      loading: false,
      error: null as string | null,
    };

    it('selectAllTodos retorna a lista completa', () => {
      expect(selectAllTodos.projector(estadoSlice)).toEqual(todos);
    });

    it('selectPendingTodos retorna apenas não concluídas', () => {
      const pendentes = selectPendingTodos.projector(todos);
      expect(pendentes).toHaveLength(2);
      expect(pendentes.every((t) => !t.completed)).toBe(true);
    });
  });

  describe('effects', () => {
    let actions$: ReplaySubject<Action>;
    let effects: TodoEffects;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      actions$ = new ReplaySubject(1);
      TestBed.configureTestingModule({
        providers: [
          TodoEffects,
          provideMockActions(() => actions$ as Observable<Action>),
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      });

      effects = TestBed.inject(TodoEffects);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('loadTodos dispara HTTP mockada e despacha sucesso', (done) => {
      effects.loadTodos$.pipe(take(1)).subscribe((acao) => {
        expect(acao).toEqual(
          loadTodosSuccess({
            todos: [{ id: 1, title: 'Comprar leite', completed: false }],
          }),
        );
        done();
      });

      actions$.next(loadTodos());

      const req = httpMock.expectOne(TODO_HTTP_MOCK_URL);
      req.flush([
        {
          id: 1,
          userId: 1,
          title: 'Comprar leite',
          completed: false,
        },
      ]);
    });

    it('loadTodos despacha erro quando a requisição falha', (done) => {
      effects.loadTodos$.pipe(take(1)).subscribe((acao) => {
        expect(acao).toEqual(loadTodosError({ error: 'Falha ao carregar tarefas.' }));
        done();
      });

      actions$.next(loadTodos());

      const req = httpMock.expectOne(TODO_HTTP_MOCK_URL);
      req.error(new ProgressEvent('erro'));
    });
  });
});
