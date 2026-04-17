import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { User } from '../models/user.model';
import { UsersApiService } from './users-api.service';

describe('UsersApiService', () => {
  let servicoUsuarios: UsersApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicoUsuarios = TestBed.inject(UsersApiService);
  });

  it('should be created', () => {
    expect(servicoUsuarios).toBeTruthy();
  });

  it('getAll should return seeded user after delay', fakeAsync(() => {
    let listaRecebida: User[] | undefined;
    servicoUsuarios.getAll().subscribe((listaDaApi) => (listaRecebida = listaDaApi));
    expect(listaRecebida).toBeUndefined();
    tick(450);
    expect(listaRecebida?.length).toBeGreaterThanOrEqual(1);
    expect(listaRecebida?.[0].email).toContain('@');
  }));

  it('save should append new user', fakeAsync(() => {
    let listaAntesDaInclusao: User[] = [];
    servicoUsuarios.getAll().subscribe((lista) => (listaAntesDaInclusao = lista));
    tick(450);
    const quantidadeInicial = listaAntesDaInclusao.length;

    let usuarioCriado: User | undefined;
    servicoUsuarios
      .save({
        nome: 'Test Hehehehehe',
        email: 'test@hehehehehe.com',
        cpf: '39053344705',
        telefone: '21988887777',
        tipoTelefone: 'CELULAR',
      })
      .subscribe((usuarioRetornado) => (usuarioCriado = usuarioRetornado));
    tick(350);
    expect(usuarioCriado?.id).toBeTruthy();

    let listaDepoisDaInclusao: User[] = [];
    servicoUsuarios.getAll().subscribe((lista) => (listaDepoisDaInclusao = lista));
    tick(450);
    expect(listaDepoisDaInclusao.length).toBe(quantidadeInicial + 1);
  }));

  it('save should update existing user by id', fakeAsync(() => {
    let listaCompleta: User[] = [];
    servicoUsuarios.getAll().subscribe((lista) => (listaCompleta = lista));
    tick(450);
    const identificadorUsuario = listaCompleta[0].id;

    let usuarioAtualizado: User | undefined;
    servicoUsuarios
      .save({
        id: identificadorUsuario,
        nome: 'Daniel Atualizado',
        email: listaCompleta[0].email,
        cpf: listaCompleta[0].cpf,
        telefone: listaCompleta[0].telefone,
        tipoTelefone: listaCompleta[0].tipoTelefone,
      })
      .subscribe((usuarioRetornado) => (usuarioAtualizado = usuarioRetornado));
    tick(350);
    expect(usuarioAtualizado?.nome).toBe('Daniel Atualizado');

    listaCompleta = [];
    servicoUsuarios.getAll().subscribe((lista) => (listaCompleta = lista));
    tick(450);
    const usuarioNaLista = listaCompleta.find((cadastro) => cadastro.id === identificadorUsuario);
    expect(usuarioNaLista?.nome).toBe('Daniel Atualizado');
  }));
});
