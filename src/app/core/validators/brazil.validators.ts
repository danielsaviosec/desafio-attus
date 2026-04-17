import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function cpfPossuiDigitosVerificadoresValidos(digitosSomente: string): boolean {
  if (digitosSomente.length !== 11 || /^(\d)\1{10}$/.test(digitosSomente)) {
    return false;
  }

  let soma = 0;
  for (let posicao = 0; posicao < 9; posicao++) {
    soma += Number(digitosSomente[posicao]) * (10 - posicao);
  }
  let restoDivisao = (soma * 10) % 11;
  if (restoDivisao === 10) {
    restoDivisao = 0;
  }
  if (restoDivisao !== Number(digitosSomente[9])) {
    return false;
  }

  soma = 0;
  for (let posicao = 0; posicao < 10; posicao++) {
    soma += Number(digitosSomente[posicao]) * (11 - posicao);
  }
  restoDivisao = (soma * 10) % 11;
  if (restoDivisao === 10) {
    restoDivisao = 0;
  }
  return restoDivisao === Number(digitosSomente[10]);
}

export function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const valorBruto = control.value;
  if (valorBruto === null || valorBruto === undefined || valorBruto === '') {
    return null;
  }
  const digitosSomente = String(valorBruto).replace(/\D/g, '');
  if (digitosSomente.length !== 11) {
    return { cpf: true };
  }
  return cpfPossuiDigitosVerificadoresValidos(digitosSomente) ? null : { cpf: true };
}

export function brazilPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const valorBruto = control.value;
  if (valorBruto === null || valorBruto === undefined || valorBruto === '') {
    return null;
  }
  const digitosSomente = String(valorBruto).replace(/\D/g, '');
  if (digitosSomente.length < 10 || digitosSomente.length > 11) {
    return { telefone: true };
  }
  return null;
}

export function strictEmailValidator(): ValidatorFn {
  return (campo: AbstractControl): ValidationErrors | null => {
    const valorBruto = campo.value;
    if (valorBruto === null || valorBruto === undefined || valorBruto === '') {
      return null;
    }
    const enderecoEmail = String(valorBruto).trim();
    const padraoEmailSimples = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return padraoEmailSimples.test(enderecoEmail) ? null : { email: true };
  };
}
