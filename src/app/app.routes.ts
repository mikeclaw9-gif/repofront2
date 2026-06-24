import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
      },
      {
        path: 'pos',
        loadChildren: () => import('./modules/pos/pos.routes').then(m => m.posRoutes),
      },
      {
        path: 'clients',
        loadChildren: () => import('./modules/clients/clients.routes').then(m => m.clientsRoutes),
      },
      {
        path: 'inventory',
        loadChildren: () => import('./modules/inventory/inventory.routes').then(m => m.inventoryRoutes),
      },
      {
        path: 'servicios',
        loadChildren: () => import('./modules/servicios/servicios.routes').then(m => m.serviciosRoutes),
      },
      {
        path: 'suppliers',
        loadChildren: () => import('./modules/suppliers/suppliers.routes').then(m => m.suppliersRoutes),
      },
      {
        path: 'reports',
        loadChildren: () => import('./modules/reports/reports.routes').then(m => m.reportsRoutes),
      },
      {
        path: 'expenses',
        loadChildren: () => import('./modules/expenses/expenses.routes').then(m => m.expensesRoutes),
      },
      {
        path: 'cash-closure',
        loadChildren: () => import('./modules/cash-closure/cash-closure.routes').then(m => m.cashClosureRoutes),
      },
    ],
  },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth' },
];
