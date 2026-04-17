import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PhoneType, User, UserDraft } from '../../core/models/user.model';
import {
  brazilPhoneValidator,
  cpfValidator,
  strictEmailValidator,
} from '../../core/validators/brazil.validators';

export interface UserFormDialogData {
  mode: 'create' | 'edit';
  user?: User;
}

const OPCOES_TIPO_TELEFONE: PhoneType[] = ['CELULAR', 'RESIDENCIAL', 'COMERCIAL'];

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
})
export class UserFormDialogComponent {
  readonly #construtorFormulario = inject(FormBuilder);
  readonly #referenciaDialogo = inject(
    MatDialogRef<UserFormDialogComponent, UserDraft | undefined>,
  );
  readonly dadosDialogo = inject<UserFormDialogData>(MAT_DIALOG_DATA);

  readonly opcoesTipoTelefone = OPCOES_TIPO_TELEFONE;

  readonly formularioUsuario = this.#construtorFormulario.nonNullable.group({
    email: ['', [Validators.required, strictEmailValidator()]],
    nome: ['', [Validators.required]],
    cpf: ['', [Validators.required, cpfValidator]],
    telefone: ['', [Validators.required, brazilPhoneValidator]],
    tipoTelefone: this.#construtorFormulario.nonNullable.control<PhoneType>('CELULAR', [
      Validators.required,
    ]),
  });

  constructor() {
    if (this.dadosDialogo.mode === 'edit' && this.dadosDialogo.user) {
      const usuarioCarregado = this.dadosDialogo.user;
      this.formularioUsuario.patchValue({
        email: usuarioCarregado.email,
        nome: usuarioCarregado.nome,
        cpf: usuarioCarregado.cpf,
        telefone: usuarioCarregado.telefone,
        tipoTelefone: usuarioCarregado.tipoTelefone,
      });
    }
  }

  get tituloDialogo(): string {
    return this.dadosDialogo.mode === 'edit' ? 'Editar usuário' : 'Adicionar novo usuário';
  }

  salvar(): void {
    if (this.formularioUsuario.invalid) {
      this.formularioUsuario.markAllAsTouched();
      return;
    }
    const valoresPreenchidos = this.formularioUsuario.getRawValue();
    const rascunhoUsuario: UserDraft = {
      ...(this.dadosDialogo.mode === 'edit' && this.dadosDialogo.user
        ? { id: this.dadosDialogo.user.id }
        : {}),
      nome: valoresPreenchidos.nome,
      email: valoresPreenchidos.email,
      cpf: valoresPreenchidos.cpf,
      telefone: valoresPreenchidos.telefone,
      tipoTelefone: valoresPreenchidos.tipoTelefone,
    };
    this.#referenciaDialogo.close(rascunhoUsuario);
  }

  cancelar(): void {
    this.#referenciaDialogo.close(undefined);
  }
}
