export type PhoneType = 'CELULAR' | 'RESIDENCIAL' | 'COMERCIAL';

export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  tipoTelefone: PhoneType;
}

export interface UserDraft {
  id?: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  tipoTelefone: PhoneType;
}
