import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

import { ApiService } from '../../core/services/api.service';
import { ServiceOrder } from '../../core/models/auth.models';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, CardModule, TagModule, RouterLink],
  template: `
        <h1>Dashboard</h1>
        <div class="status-bar">
          <span class="status-indicator" [class.online]="serverOnline" [class.offline]="!serverOnline">
            {{ serverOnline ? 'Servidor en línea' : 'Servidor fuera de línea' }}
          </span>
        </div>
        <div class="stats-grid">
          <p-card styleClass="stat-card">
            <h3>Órdenes activas</h3>
            <p class="stat-value">{{ activeOrders.length }}</p>
          </p-card>
        </div>
        <h2>Órdenes activas</h2>
        <div class="orders-list">
          <p-card *ngFor="let order of activeOrders" styleClass="order-card">
            <div class="order-header">
              <strong>#{{ order.id }}</strong>
              <p-tag [value]="order.status" [severity]="getStatusSeverity(order.status)"></p-tag>
            </div>
            <p>Cliente: {{ order.clientName || 'Sin cliente' }}</p>
            <p>Total: \${{ order.totalAmount.toFixed(2) }}</p>
          </p-card>
        </div>
  `,
  styles: [`
    .status-bar { margin-bottom: 1rem; }
    .status-indicator {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.5rem 1rem; border-radius: 20px; font-weight: 500; font-size: 0.875rem;
    }
    .status-indicator.online { background: #d4edda; color: #155724; }
    .status-indicator.offline { background: #f8d7da; color: #721c24; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat-value { font-size: 2rem; font-weight: 700; margin: 0; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .orders-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly api = inject(ApiService);
  serverOnline = false;
  activeOrders: ServiceOrder[] = [];
  private subscription?: Subscription;

  ngOnInit(): void {
    this.loadData();
    this.subscription = interval(30000)
      .pipe(switchMap(() => this.api.checkHealth()))
      .subscribe({
        next: () => { this.serverOnline = true; },
        error: () => { this.serverOnline = false; },
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadData(): void {
    this.api.checkHealth().subscribe({
      next: () => { this.serverOnline = true; },
      error: () => { this.serverOnline = false; },
    });
    this.api.getActiveOrders().subscribe({
      next: (orders) => { this.activeOrders = orders; },
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    const map: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
      PENDIENTE: 'warning',
      EN_PROCESO: 'info',
      LISTO: 'success',
      ENTREGADO: 'danger',
    };
    return map[status] || 'info';
  }
}
