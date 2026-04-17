import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter, take } from 'rxjs';
import { User } from '../../core/models/user.model';
import { UserFormDialogComponent, UserFormDialogData } from './user-form-dialog.component';
import { UsersStore } from './users.store';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  readonly #caixaDialogo = inject(MatDialog);
  readonly usersStore = inject(UsersStore);

  readonly campoBuscaPorNome = new FormControl('', { nonNullable: true });

  constructor() {
    this.usersStore.load();
    this.campoBuscaPorNome.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((textoDigitadoNaBusca) => this.usersStore.setNameFilter(textoDigitadoNaBusca));
  }

  abrirCadastro(): void {
    const referenciaDialogo = this.#caixaDialogo.open(UserFormDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      autoFocus: 'first-tabbable',
      data: { mode: 'create' } satisfies UserFormDialogData,
    });
    referenciaDialogo
      .afterClosed()
      .pipe(
        filter((resultado): resultado is NonNullable<typeof resultado> => !!resultado),
        take(1),
      )
      .subscribe((rascunhoUsuario) => this.usersStore.save(rascunhoUsuario));
  }

  abrirEdicao(usuarioSelecionado: User): void {
    const referenciaDialogo = this.#caixaDialogo.open(UserFormDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      autoFocus: 'first-tabbable',
      data: { mode: 'edit', user: usuarioSelecionado } satisfies UserFormDialogData,
    });
    referenciaDialogo
      .afterClosed()
      .pipe(
        filter((resultado): resultado is NonNullable<typeof resultado> => !!resultado),
        take(1),
      )
      .subscribe((rascunhoUsuario) => this.usersStore.save(rascunhoUsuario));
  }
}
