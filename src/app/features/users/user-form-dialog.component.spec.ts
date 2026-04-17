import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { User } from '../../core/models/user.model';
import { UserFormDialogComponent } from './user-form-dialog.component';

describe('UserFormDialogComponent', () => {
  let fecharDialogo: jest.Mock;

  function montarComponente(dadosParaDialogo: {
    mode: 'create' | 'edit';
    user?: User;
  }): ComponentFixture<UserFormDialogComponent> {
    fecharDialogo = jest.fn();
    TestBed.configureTestingModule({
      imports: [UserFormDialogComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MatDialogRef, useValue: { close: fecharDialogo } },
        { provide: MAT_DIALOG_DATA, useValue: dadosParaDialogo },
      ],
    });
    const fixture = TestBed.createComponent(UserFormDialogComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('should create in create mode', () => {
    const fixture = montarComponente({ mode: 'create' });
    expect(fixture.componentInstance.tituloDialogo).toBe('Adicionar novo usuário');
  });

  it('should disable save when form is invalid', () => {
    const fixture = montarComponente({ mode: 'create' });
    const botaoSalvar: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-save');
    expect(botaoSalvar.disabled).toBe(true);
  });

  it('salvar should close dialog with draft when valid', () => {
    const fixture = montarComponente({ mode: 'create' });
    fixture.componentInstance.formularioUsuario.setValue({
      email: 'novo@example.com',
      nome: 'Fulano',
      cpf: '52998224725',
      telefone: '11987654321',
      tipoTelefone: 'CELULAR',
    });
    fixture.componentInstance.salvar();
    expect(fecharDialogo).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Fulano',
        email: 'novo@example.com',
      }),
    );
  });

  it('cancelar should close without value', () => {
    const fixture = montarComponente({ mode: 'create' });
    fixture.componentInstance.cancelar();
    expect(fecharDialogo).toHaveBeenCalledWith(undefined);
  });

  it('salvar should mark touched when invalid', () => {
    const fixture = montarComponente({ mode: 'create' });
    fixture.componentInstance.formularioUsuario.setValue({
      email: '',
      nome: '',
      cpf: '',
      telefone: '',
      tipoTelefone: 'CELULAR',
    });
    fixture.componentInstance.salvar();
    expect(fixture.componentInstance.formularioUsuario.touched).toBe(true);
    expect(fecharDialogo).not.toHaveBeenCalled();
  });

  it('should prefill form in edit mode', () => {
    const usuarioParaEdicao: User = {
      id: 'u-1',
      nome: 'Maria',
      email: 'maria@example.com',
      cpf: '39053344705',
      telefone: '21988887777',
      tipoTelefone: 'RESIDENCIAL',
    };
    const fixture = montarComponente({ mode: 'edit', user: usuarioParaEdicao });
    expect(fixture.componentInstance.tituloDialogo).toBe('Editar usuário');
    expect(fixture.componentInstance.formularioUsuario.controls.nome.value).toBe('Maria');
  });

  it('salvar in edit mode should include user id in draft', () => {
    const usuarioParaEdicao: User = {
      id: 'u-99',
      nome: 'Maria',
      email: 'maria@example.com',
      cpf: '39053344705',
      telefone: '21988887777',
      tipoTelefone: 'RESIDENCIAL',
    };
    const fixture = montarComponente({ mode: 'edit', user: usuarioParaEdicao });
    fixture.componentInstance.formularioUsuario.setValue({
      email: 'maria2@example.com',
      nome: 'Maria Dois',
      cpf: '52998224725',
      telefone: '11987654321',
      tipoTelefone: 'CELULAR',
    });
    fixture.componentInstance.salvar();
    expect(fecharDialogo).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'u-99',
        nome: 'Maria Dois',
      }),
    );
  });
});
