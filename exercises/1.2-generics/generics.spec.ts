import { usuariosFiltradosPorNome, filtrarEPaginar, type Usuario } from './generics';

describe('Exercício 1.2 — filtrarEPaginar', () => {
  const data: Usuario[] = [
    { id: 1, nome: 'Daniel', email: 'daniel@email.com' },
    { id: 2, nome: 'Isabelle', email: 'isabelle@email.com' },
    { id: 3, nome: 'Maria', email: 'maria@email.com' },
  ];

  it('retorna todos na primeira página quando o filtro não exclui ninguém', () => {
    const resultado = filtrarEPaginar(data, () => true, { pagina: 1, tamanho: 2 });
    expect(resultado.total).toBe(3);
    expect(resultado.itens).toEqual([data[0], data[1]]);
  });

  it('aplica filtro e total reflete apenas os filtrados', () => {
    const resultado = filtrarEPaginar(data, (u) => u.nome.startsWith('Daniel'), {
      pagina: 1,
      tamanho: 10,
    });
    expect(resultado.total).toBe(2);
    expect(resultado.itens.map((u) => u.id)).toEqual([1, 3]);
  });

  it('pagina corretamente após o filtro', () => {
    const resultado = filtrarEPaginar(data, (u) => u.nome.includes('a') || u.nome.includes('A'), {
      pagina: 2,
      tamanho: 1,
    });
    expect(resultado.total).toBe(2);
    expect(resultado.itens).toEqual([data[2]]);
  });

  it('retorna página vazia quando a página está além dos resultados filtrados', () => {
    const resultado = filtrarEPaginar(data, () => true, { pagina: 99, tamanho: 2 });
    expect(resultado.total).toBe(3);
    expect(resultado.itens).toEqual([]);
  });

  it('normaliza pagina e tamanho inválidos para pelo menos 1', () => {
    const resultado = filtrarEPaginar(data, () => true, { pagina: 0, tamanho: 0 });
    expect(resultado.total).toBe(3);
    expect(resultado.itens).toHaveLength(1);
    expect(resultado.itens[0]).toEqual(data[0]);
  });
});

describe('Exercício 1.2 — exemplo concreto (usuários por nome)', () => {
  it('filtra por nome e pagina (exemploUsuariosFiltradosPorNome)', () => {
    const pessoa1 = usuariosFiltradosPorNome('secundino', { pagina: 1, tamanho: 1 });
    expect(pessoa1.total).toBe(2);
    expect(pessoa1.itens).toHaveLength(1);
    expect(pessoa1.itens[0].nome).toBe('Daniel Secundino');

    const pessoa2 = usuariosFiltradosPorNome('lima', { pagina: 2, tamanho: 1 });
    expect(pessoa2.total).toBe(2);
    expect(pessoa2.itens[0].nome).toBe('Daniel Lima');
  });

  it('termo vazio inclui todos os usuários de exemplo', () => {
    const resultado = usuariosFiltradosPorNome('', { pagina: 1, tamanho: 10 });
    expect(resultado.total).toBe(4);
    expect(resultado.itens).toHaveLength(4);
  });
});
