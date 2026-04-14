import { Verdureira } from './refatoracao';

describe('Exercício 1.1 — Verdureira', () => {
  let verdureira: Verdureira;

  beforeEach(() => {
    verdureira = new Verdureira();
  });

  it('retorna descrição formatada quando o produto existe', () => {
    expect(verdureira.getDescricaoProduto(1)).toBe('1 - Maçã (20x)');
    expect(verdureira.getDescricaoProduto(2)).toBe('2 - Laranja (0x)');
    expect(verdureira.getDescricaoProduto(3)).toBe('3 - Limão (20x)');
  });

  it('indica estoque apenas quando a quantidade é maior que zero', () => {
    expect(verdureira.hasEstoqueProduto(1)).toBe(true);
    expect(verdureira.hasEstoqueProduto(2)).toBe(false);
    expect(verdureira.hasEstoqueProduto(3)).toBe(true);
  });

  it('não lança erro e informa quando o produto não existe (getDescricaoProduto)', () => {
    expect(verdureira.getDescricaoProduto(999)).toBe('Produto não encontrado');
  });

  it('não lança erro quando o produto não existe (hasEstoqueProduto)', () => {
    expect(verdureira.hasEstoqueProduto(999)).toBe(false);
  });
});
