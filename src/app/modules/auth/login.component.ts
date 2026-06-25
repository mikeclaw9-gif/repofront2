import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, PasswordModule, CardModule, MessageModule, NgIf, NgClass],
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
        <div class="backend-status" [ngClass]="backendStatus">
          <span *ngIf="backendStatus === 'ok'" class="status-text ok">LaundryBackend OK</span>
          <span *ngIf="backendStatus === 'ko'" class="status-text ko">LaundryBackend KO — {{ backendError }}</span>
          <span *ngIf="backendStatus === 'checking'" class="status-text checking">Verificando backend...</span>
        </div>
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
    .backend-status {
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--surface-border);
      text-align: center;
    }
    .status-text { font-size: 0.8rem; font-weight: 600; }
    .status-text.ok { color: #22c55e; }
    .status-text.ko { color: #ef4444; }
    .status-text.checking { color: var(--text-color-secondary); }
  `]
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  loading = false;
  error = '';
  backendStatus: 'checking' | 'ok' | 'ko' = 'checking';
  backendError = '';

  ngOnInit(): void {
    this.api.checkHealth().subscribe({
      next: () => this.backendStatus = 'ok',
      error: (err) => {
        this.backendStatus = 'ko';
        this.backendError = err.status ? `HTTP ${err.status}` : err.message || 'Error de conexión';
      },
    });
  }

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
