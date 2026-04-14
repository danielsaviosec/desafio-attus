import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';
import { PostsApiService } from './posts-api.service';

describe('PostsApiService', () => {
  let service: PostsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostsApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PostsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve buscar lista de posts com limite padrão', () => {
    const mockPosts: Post[] = [
      { userId: 1, id: 1, title: 'post 1', body: 'body 1' },
      { userId: 1, id: 2, title: 'post 2', body: 'body 2' },
    ];

    service.getPosts().subscribe((posts) => {
      expect(posts.length).toBe(2);
      expect(posts[0].title).toBe('post 1');
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts?_limit=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('deve buscar lista de posts com limite customizado', () => {
    service.getPosts(3).subscribe();

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts?_limit=3');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
