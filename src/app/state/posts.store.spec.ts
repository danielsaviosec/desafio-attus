import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Post } from '../core/models/post.model';
import { PostsApiService } from '../core/services/posts-api.service';
import { PostsStore } from './posts.store';

describe('PostsStore', () => {
  it('deve carregar posts com sucesso', fakeAsync(() => {
    const mockPosts: Post[] = [
      { userId: 1, id: 1, title: 'A', body: 'B' },
      { userId: 2, id: 2, title: 'C', body: 'D' },
    ];

    TestBed.configureTestingModule({
      providers: [
        PostsStore,
        {
          provide: PostsApiService,
          useValue: {
            getPosts: jest.fn().mockReturnValue(of(mockPosts)),
          },
        },
      ],
    });

    const store = TestBed.inject(PostsStore);

    store.load();
    tick();

    expect(store.items().length).toBe(2);
    expect(store.error()).toBeNull();
    expect(store.loading()).toBe(false);
  }));

  it('deve definir erro quando API falha', fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        PostsStore,
        {
          provide: PostsApiService,
          useValue: {
            getPosts: jest.fn().mockReturnValue(throwError(() => new Error('Falha na API'))),
          },
        },
      ],
    });

    const store = TestBed.inject(PostsStore);

    store.load();
    tick();

    expect(store.items()).toEqual([]);
    expect(store.error()).toBe('Falha na API');
    expect(store.loading()).toBe(false);
  }));

  it('deve usar mensagem padrão quando erro não for instância de Error', fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        PostsStore,
        {
          provide: PostsApiService,
          useValue: {
            getPosts: jest.fn().mockReturnValue(throwError(() => 'erro')),
          },
        },
      ],
    });

    const store = TestBed.inject(PostsStore);

    store.load();
    tick();

    expect(store.items()).toEqual([]);
    expect(store.error()).toBe('Erro ao carregar posts.');
    expect(store.loading()).toBe(false);
  }));
});
