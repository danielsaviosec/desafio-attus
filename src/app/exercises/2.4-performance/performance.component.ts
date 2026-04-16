import { ChangeDetectionStrategy, Component } from '@angular/core';

export type UsuarioLista = {
  id: number;
  nome: string;
};

@Component({
  selector: 'app-performance-exercise',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (usuario of usuarios; track usuario.id) {
        <li data-testid="usuario-item">{{ usuario.id }} - {{ usuario.nome }}</li>
      }
    </ul>
  `,
})
export class PerformanceComponent {
  usuarios: UsuarioLista[] = [
    { id: 1, nome: 'Daniel Savio' },
    { id: 2, nome: 'Isabelle Costa' },
    { id: 3, nome: 'Domingos Secundino' },
    { id: 4, nome: 'Mauricia Lima' },
  ];

  prependUsuario(usuario: UsuarioLista): void {
    this.usuarios = [usuario, ...this.usuarios];
  }

  substituirListaComMesmosIds(): void {
    this.usuarios = this.usuarios.map((usuario) => ({ ...usuario }));
  }
}
