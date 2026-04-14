export interface PaginaParams {
  pagina: number;
  tamanho: number;
}

export interface Pagina<T> {
  itens: T[];
  total: number;
}

export function filtrarEPaginar<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  params: PaginaParams,
): Pagina<T> {
  const filtrados = data.filter(filterFn);
  const total = filtrados.length;
  const tamanho = Math.max(1, Math.floor(params.tamanho));
  const pagina = Math.max(1, Math.floor(params.pagina));
  const inicio = (pagina - 1) * tamanho;
  const itens = filtrados.slice(inicio, inicio + tamanho);
  return { itens, total };
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

const usuariosMock: Usuario[] = [
  { id: 1, nome: 'Daniel Savio', email: 'daniel@email.com' },
  { id: 2, nome: 'Isabelle Costa', email: 'isabelle@email.com' },
  { id: 3, nome: 'Domingos Secundino', email: 'domingos@example.com' },
  { id: 4, nome: 'Mauricia Lima', email: 'mauricia@example.com' },
];

export function usuariosFiltradosPorNome(termo: string, params: PaginaParams): Pagina<Usuario> {
  const normalizado = termo.trim().toLowerCase();
  return filtrarEPaginar(
    usuariosMock,
    (usuario: Usuario) => usuario.nome.toLowerCase().includes(normalizado),
    params,
  );
}
