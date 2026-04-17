import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { User } from '../../core/models/user.model';
import { UsersApiService } from '../../core/services/users-api.service';
import { UsersStore } from './users.store';

describe('UsersStore', () => {
  const listaUsuariosFixture: User[] = [
    {
      id: '1',
      nome: 'Ana Silva',
      email: 'ana@test.com',
      cpf: '52998224725',
      telefone: '11999998888',
      tipoTelefone: 'CELULAR',
    },
    {
      id: '2',
      nome: 'Bruno Costa',
      email: 'bruno@test.com',
      cpf: '39053344705',
      telefone: '11888887777',
      tipoTelefone: 'RESIDENCIAL',
    },
  ];

  let servicoUsuariosSimulado: jest.Mocked<Pick<UsersApiService, 'getAll' | 'save'>>;

  beforeEach(() => {
    servicoUsuariosSimulado = {
      getAll: jest.fn().mockReturnValue(of([...listaUsuariosFixture])),
      save: jest.fn().mockImplementation((rascunhoRecebido) =>
        of({
          id: rascunhoRecebido.id ?? 'new-id',
          nome: rascunhoRecebido.nome,
          email: rascunhoRecebido.email,
          cpf: rascunhoRecebido.cpf.replace(/\D/g, ''),
          telefone: rascunhoRecebido.telefone.replace(/\D/g, ''),
          tipoTelefone: rascunhoRecebido.tipoTelefone,
        } satisfies User),
      ),
    };

    TestBed.configureTestingModule({
      providers: [UsersStore, { provide: UsersApiService, useValue: servicoUsuariosSimulado }],
    });
  });

  it('load should populate items', fakeAsync(() => {
    const armazenamentoUsuarios = TestBed.inject(UsersStore);
    armazenamentoUsuarios.load();
    tick(450);
    expect(servicoUsuariosSimulado.getAll).toHaveBeenCalled();
    expect(armazenamentoUsuarios.items().length).toBe(2);
    expect(armazenamentoUsuarios.loading()).toBe(false);
  }));

  it('load should set error when API fails', fakeAsync(() => {
    servicoUsuariosSimulado.getAll.mockReturnValueOnce(throwError(() => new Error('falhou')));
    const armazenamentoUsuarios = TestBed.inject(UsersStore);
    armazenamentoUsuarios.load();
    tick(450);
    expect(armazenamentoUsuarios.error()).toContain('falhou');
    expect(armazenamentoUsuarios.items().length).toBe(0);
  }));

  it('load should map non-Error failures to default message', fakeAsync(() => {
    servicoUsuariosSimulado.getAll.mockReturnValueOnce(throwError(() => 'x'));
    const armazenamentoUsuarios = TestBed.inject(UsersStore);
    armazenamentoUsuarios.load();
    tick(450);
    expect(armazenamentoUsuarios.error()).toBe('Não foi possível completar a operação.');
  }));

  it('setNameFilter should debounce', fakeAsync(() => {
    const armazenamentoUsuarios = TestBed.inject(UsersStore);
    armazenamentoUsuarios.load();
    tick(450);
    armazenamentoUsuarios.setNameFilter('An');
    armazenamentoUsuarios.setNameFilter('Ana');
    tick(350);
    expect(armazenamentoUsuarios.nameFilter()).toBe('Ana');
    expect(armazenamentoUsuarios.filteredItems().length).toBe(1);
  }));

  it('setNameFilter empty should show all items', fakeAsync(() => {
    const armazenamentoUsuarios = TestBed.inject(UsersStore);
    armazenamentoUsuarios.load();
    tick(450);
    armazenamentoUsuarios.setNameFilter('Inexistente');
    tick(350);
    expect(armazenamentoUsuarios.filteredItems().length).toBe(0);
    armazenamentoUsuarios.setNameFilter('');
    tick(350);
    expect(armazenamentoUsuarios.filteredItems().length).toBe(2);
  }));

  it('save should merge user', fakeAsync(() => {
    const armazenamentoUsuarios = TestBed.inject(UsersStore);
    armazenamentoUsuarios.load();
    tick(450);
    armazenamentoUsuarios.save({
      nome: 'Novo',
      email: 'novo@test.com',
      cpf: '39053344705',
      telefone: '11777776666',
      tipoTelefone: 'CELULAR',
    });
    tick(350);
    expect(servicoUsuariosSimulado.save).toHaveBeenCalled();
    expect(
      armazenamentoUsuarios.items().some((usuarioCadastrado) => usuarioCadastrado.nome === 'Novo'),
    ).toBe(true);
  }));

  it('save should set saveError when API fails', fakeAsync(() => {
    servicoUsuariosSimulado.save.mockReturnValueOnce(throwError(() => new Error('erro save')));
    const armazenamentoUsuarios = TestBed.inject(UsersStore);
    armazenamentoUsuarios.load();
    tick(450);
    armazenamentoUsuarios.save({
      nome: 'Novo',
      email: 'novo@test.com',
      cpf: '39053344705',
      telefone: '11777776666',
      tipoTelefone: 'CELULAR',
    });
    tick(350);
    expect(armazenamentoUsuarios.saveError()).toContain('erro save');
  }));

  it('save should replace existing item by id', fakeAsync(() => {
    servicoUsuariosSimulado.save.mockImplementationOnce((rascunhoRecebido) =>
      of({
        id: rascunhoRecebido.id ?? 'ignored',
        nome: rascunhoRecebido.nome,
        email: rascunhoRecebido.email,
        cpf: rascunhoRecebido.cpf.replace(/\D/g, ''),
        telefone: rascunhoRecebido.telefone.replace(/\D/g, ''),
        tipoTelefone: rascunhoRecebido.tipoTelefone,
      }),
    );
    const armazenamentoUsuarios = TestBed.inject(UsersStore);
    armazenamentoUsuarios.load();
    tick(450);
    armazenamentoUsuarios.save({
      id: '1',
      nome: 'Ana Silva Editada',
      email: 'ana@test.com',
      cpf: '52998224725',
      telefone: '11999998888',
      tipoTelefone: 'CELULAR',
    });
    tick(350);
    expect(armazenamentoUsuarios.items().find((usuario) => usuario.id === '1')?.nome).toBe(
      'Ana Silva Editada',
    );
  }));

  it('save should map non-Error failures to default message', fakeAsync(() => {
    servicoUsuariosSimulado.save.mockReturnValueOnce(throwError(() => ({ code: 500 })));
    const armazenamentoUsuarios = TestBed.inject(UsersStore);
    armazenamentoUsuarios.load();
    tick(450);
    armazenamentoUsuarios.save({
      nome: 'Novo',
      email: 'novo@test.com',
      cpf: '39053344705',
      telefone: '11777776666',
      tipoTelefone: 'CELULAR',
    });
    tick(350);
    expect(armazenamentoUsuarios.saveError()).toBe('Não foi possível completar a operação.');
  }));
});
