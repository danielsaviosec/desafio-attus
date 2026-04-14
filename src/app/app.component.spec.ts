import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { PostsStore } from './state/posts.store';

describe('AppComponent', () => {
  const mockPostsStore = {
    items: signal([]),
    loading: signal(false),
    error: signal<string | null>(null),
    load: jest.fn(),
  };

  beforeEach(async () => {
    mockPostsStore.load.mockClear();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideNoopAnimations(), { provide: PostsStore, useValue: mockPostsStore }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the expected title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Boilerplate Angular 17');
  });

  it('should render card title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Integração REST com Signal Store');
  });

  it('should call load when recarregarPosts is triggered', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.recarregarPosts();

    expect(mockPostsStore.load).toHaveBeenCalled();
  });
});
