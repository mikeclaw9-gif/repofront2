import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, PasswordModule, CardModule, MessageModule, NgIf],
  template: `
    <div class="login-container">
      <p-card header="Laundry POS" subheader="Iniciar sesión" styleClass="login-card">
        <form (ngSubmit)="login()">
          <div class="field">
            <label for="username">Usuario</label>
            <input id="username" type="text" pInputText [(ngModel)]="username" name="username" required />
          </div>
          <div class="field">
            <label for="password">Contraseña</label>
            <p-password id="password" [(ngModel)]="password" name="password" [feedback]="false" [toggleMask]="true" styleClass="full-width"></p-password>
          </div>
          <p-message *ngIf="error" severity="error" [text]="error"></p-message>
          <p-button type="submit" label="Ingresar" [loading]="loading" styleClass="p-button-primary full-width mt-2"></p-button>
        </form>
      </p-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-ground);
    }
    .login-card {
      width: 100%;
      max-width: 400px;
    }
    .full-width { width: 100%; }
    .field { margin-bottom: 1rem; }
    .field label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    :host ::ng-deep .p-password { width: 100%; }
    :host ::ng-deep .p-password input { width: 100%; }
  `]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  loading = false;
  error = '';

  login(): void {
    this.loading = true;
    this.error = '';
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al iniciar sesión';
        this.loading = false;
      },
    });
  }
}
