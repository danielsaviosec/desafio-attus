import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { User } from '../../core/models/user.model';
import { UsersPageComponent } from './users-page.component';
import { UsersStore } from './users.store';

describe('UsersPageComponent', () => {
  const listaUsuariosMock: User[] = [
    {
      id: '1',
      nome: 'Ana',
      email: 'ana@test.com',
      cpf: '52998224725',
      telefone: '11999998888',
      tipoTelefone: 'CELULAR',
    },
  ];

  let armazenamentoUsuariosSimulado: {
    load: jest.Mock;
    setNameFilter: jest.Mock;
    save: jest.Mock;
    loading: () => boolean;
    error: () => string | null;
    saveError: () => string | null;
    filteredItems: () => User[];
  };

  let espiaoAbrirDialogo: jest.Mock;

  beforeEach(async () => {
    armazenamentoUsuariosSimulado = {
      load: jest.fn(),
      setNameFilter: jest.fn(),
      save: jest.fn(),
      loading: () => false,
      error: () => null,
      saveError: () => null,
      filteredItems: () => listaUsuariosMock,
    };

    espiaoAbrirDialogo = jest.fn().mockReturnValue({
      afterClosed: () => of(undefined),
    });

    await TestBed.configureTestingModule({
      imports: [UsersPageComponent],
      providers: [
        provideNoopAnimations(),
        { provide: UsersStore, useValue: armazenamentoUsuariosSimulado },
        { provide: MatDialog, useValue: { open: espiaoAbrirDialogo } },
      ],
    }).compileComponents();
  });

  it('should create and load users', () => {
    const fixture = TestBed.createComponent(UsersPageComponent);
    expect(fixture.componentInstance).toBeTruthy();
    expect(armazenamentoUsuariosSimulado.load).toHaveBeenCalled();
  });

  it('abrirCadastro should open dialog', () => {
    const fixture = TestBed.createComponent(UsersPageComponent);
    fixture.componentInstance.abrirCadastro();
    expect(espiaoAbrirDialogo).toHaveBeenCalled();
  });

  it('afterClosed with result should call save', () => {
    const rascunhoUsuario = {
      nome: 'X',
      email: 'x@y.com',
      cpf: '39053344705',
      telefone: '11999999999',
      tipoTelefone: 'CELULAR' as const,
    };
    espiaoAbrirDialogo.mockReturnValueOnce({
      afterClosed: () => of(rascunhoUsuario),
    });
    const fixture = TestBed.createComponent(UsersPageComponent);
    fixture.componentInstance.abrirCadastro();
    expect(armazenamentoUsuariosSimulado.save).toHaveBeenCalledWith(rascunhoUsuario);
  });

  it('abrirEdicao should open dialog with user', () => {
    espiaoAbrirDialogo.mockReturnValueOnce({ afterClosed: () => of(undefined) });
    const fixture = TestBed.createComponent(UsersPageComponent);
    fixture.componentInstance.abrirEdicao(listaUsuariosMock[0]);
    expect(espiaoAbrirDialogo).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        data: expect.objectContaining({ mode: 'edit', user: listaUsuariosMock[0] }),
      }),
    );
  });

  it('abrirEdicao afterClosed with result should call save', () => {
    const rascunhoUsuario = {
      id: '1',
      nome: 'A',
      email: 'a@b.com',
      cpf: '39053344705',
      telefone: '11999999999',
      tipoTelefone: 'CELULAR' as const,
    };
    espiaoAbrirDialogo.mockReturnValueOnce({ afterClosed: () => of(rascunhoUsuario) });
    const fixture = TestBed.createComponent(UsersPageComponent);
    fixture.componentInstance.abrirEdicao(listaUsuariosMock[0]);
    expect(armazenamentoUsuariosSimulado.save).toHaveBeenCalledWith(rascunhoUsuario);
  });

  it('search should forward filter to store', () => {
    const fixture = TestBed.createComponent(UsersPageComponent);
    fixture.componentInstance.campoBuscaPorNome.setValue('ana');
    expect(armazenamentoUsuariosSimulado.setNameFilter).toHaveBeenCalledWith('ana');
  });
});
