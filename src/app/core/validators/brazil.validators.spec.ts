import { FormControl } from '@angular/forms';
import { brazilPhoneValidator, cpfValidator, strictEmailValidator } from './brazil.validators';

describe('brazil validators', () => {
  describe('cpfValidator', () => {
    it('should accept valid CPF without mask', () => {
      const campoCpf = new FormControl('52998224725');
      expect(cpfValidator(campoCpf)).toBeNull();
    });

    it('should reject invalid checksum', () => {
      const campoCpf = new FormControl('52998224726');
      expect(cpfValidator(campoCpf)).toEqual({ cpf: true });
    });

    it('should reject repeated digits', () => {
      const campoCpf = new FormControl('11111111111');
      expect(cpfValidator(campoCpf)).toEqual({ cpf: true });
    });

    it('should return null when empty', () => {
      const campoCpf = new FormControl('');
      expect(cpfValidator(campoCpf)).toBeNull();
    });

    it('should return null when value is null', () => {
      expect(cpfValidator(new FormControl(null))).toBeNull();
    });

    it('should reject wrong length after stripping mask', () => {
      expect(cpfValidator(new FormControl('529.982.247-2'))).toEqual({ cpf: true });
    });

    it('should reject when first verifier digit is wrong', () => {
      expect(cpfValidator(new FormControl('52998224735'))).toEqual({ cpf: true });
    });
  });

  describe('brazilPhoneValidator', () => {
    it('should accept 11 digits', () => {
      const campoTelefone = new FormControl('11987654321');
      expect(brazilPhoneValidator(campoTelefone)).toBeNull();
    });

    it('should accept 10 digits', () => {
      const campoTelefone = new FormControl('1133334444');
      expect(brazilPhoneValidator(campoTelefone)).toBeNull();
    });

    it('should reject too short', () => {
      const campoTelefone = new FormControl('1198765');
      expect(brazilPhoneValidator(campoTelefone)).toEqual({ telefone: true });
    });

    it('should return null when empty', () => {
      expect(brazilPhoneValidator(new FormControl(''))).toBeNull();
    });

    it('should return null when value is null', () => {
      expect(brazilPhoneValidator(new FormControl(null))).toBeNull();
    });

    it('should reject more than 11 digits', () => {
      expect(brazilPhoneValidator(new FormControl('551199999999999'))).toEqual({
        telefone: true,
      });
    });
  });

  describe('strictEmailValidator', () => {
    const validadorEmail = strictEmailValidator();

    it('should accept valid email', () => {
      expect(validadorEmail(new FormControl('a@b.co'))).toBeNull();
    });

    it('should reject invalid format', () => {
      expect(validadorEmail(new FormControl('not-an-email'))).toEqual({ email: true });
    });

    it('should reject domain without dot', () => {
      expect(validadorEmail(new FormControl('a@b'))).toEqual({ email: true });
    });

    it('should reject multiple at signs', () => {
      expect(validadorEmail(new FormControl('a@@b.com'))).toEqual({ email: true });
    });

    it('should reject empty local part', () => {
      expect(validadorEmail(new FormControl('@b.com'))).toEqual({ email: true });
    });

    it('should return null when empty', () => {
      expect(validadorEmail(new FormControl(''))).toBeNull();
    });

    it('should return null when value is null', () => {
      expect(validadorEmail(new FormControl(null))).toBeNull();
    });
  });
});
