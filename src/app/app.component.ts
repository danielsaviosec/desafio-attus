import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PostsStore } from './state/posts.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatToolbarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly title = 'Boilerplate Angular 17';
  readonly postsStore = inject(PostsStore);

  constructor() {
    this.postsStore.load();
  }

  recarregarPosts(): void {
    this.postsStore.load();
  }
}
