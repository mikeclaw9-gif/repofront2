import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, ButtonModule],
  host: {
    '[class.open]': 'open',
    '[class.sidebar-mobile]': 'mobile'
  },
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>Laundry POS</h2>
      </div>
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <i class="pi pi-home"></i> Dashboard
        </a>
        <a routerLink="/pos" routerLinkActive="active" class="nav-item">
          <i class="pi pi-shopping-cart"></i> POS
        </a>
        <a routerLink="/clients" routerLinkActive="active" class="nav-item">
          <i class="pi pi-users"></i> Clientes
        </a>
        <a routerLink="/inventory" routerLinkActive="active" class="nav-item">
          <i class="pi pi-box"></i> Inventario
        </a>
        <a routerLink="/servicios" routerLinkActive="active" class="nav-item">
          <i class="pi pi-wrench"></i> Servicios
        </a>
        <a routerLink="/suppliers" routerLinkActive="active" class="nav-item">
          <i class="pi pi-truck"></i> Proveedores
        </a>
        <a routerLink="/reports" routerLinkActive="active" class="nav-item">
          <i class="pi pi-chart-bar"></i> Reportes
        </a>
        <a routerLink="/expenses" routerLinkActive="active" class="nav-item">
          <i class="pi pi-dollar"></i> Gastos
        </a>
        <a routerLink="/cash-closure" routerLinkActive="active" class="nav-item">
          <i class="pi pi-calculator"></i> Corte de Caja
        </a>
      </nav>
      <div class="sidebar-footer">
        <span class="user-info">{{ username }}</span>
        <p-button label="Cerrar sesión" (onClick)="logout()" styleClass="p-button-text p-button-sm"></p-button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      width: 250px;
      height: 100vh;
      background: var(--surface-card);
      border-right: 1px solid var(--surface-border);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      transition: transform 0.3s ease;
    }
    :host(.sidebar-mobile) {
      transform: translateX(-100%);
    }
    :host(.sidebar-mobile.open) {
      transform: translateX(0);
    }
    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--surface-border);
    }
    .sidebar-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
    }
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: var(--text-color);
      text-decoration: none;
      transition: background 0.2s;
      cursor: pointer;
    }
    .nav-item:hover, .nav-item.active {
      background: var(--surface-hover);
    }
    .nav-item i {
      font-size: 1.1rem;
    }
    .sidebar-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--surface-border);
    }
    .user-info {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-color-secondary);
    }
  `]
})
export class SidebarComponent {
  @Input() open = true;
  @Input() mobile = false;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  username = this.authService.getUsername();

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
