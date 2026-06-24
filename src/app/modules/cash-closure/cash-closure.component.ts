import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, DatePipe } from '@angular/common';

import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { CashClosure } from '../../core/models/auth.models';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cash-closure',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, DatePipe, ButtonModule, InputNumberModule,
    InputTextModule, TableModule, DialogModule, CardModule, TagModule, ToastModule],
  providers: [MessageService],
  template: `
    <h1>Corte de Caja</h1>

    <div class="toolbar">
      <p-button label="Abrir corte" icon="pi pi-plus" (onClick)="showOpenDialog()"></p-button>
      <p-button label="Resumen por período" icon="pi pi-chart-line" severity="info" (onClick)="showSummaryDialog()"></p-button>
    </div>

    <p-card>
      <p-table [value]="closures" [paginator]="true" [rows]="15" styleClass="p-datatable-sm">
        <ng-template pTemplate="header">
          <tr>
            <th>ID</th>
            <th>Efectivo inicial</th>
            <th>Ventas</th>
            <th>Gastos</th>
            <th>Esperado</th>
            <th>Declarado</th>
            <th>Diferencia</th>
            <th>Estado</th>
            <th>Apertura</th>
            <th>Cierre</th>
            <th>Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-c>
          <tr>
            <td>{{ c.id }}</td>
            <td>\${{ c.initialCash.toFixed(2) }}</td>
            <td>\${{ c.totalSales.toFixed(2) }}</td>
            <td>\${{ c.totalExpenses.toFixed(2) }}</td>
            <td>\${{ c.expectedCash.toFixed(2) }}</td>
            <td>{{ c.declaredCash != null ? '$' + c.declaredCash.toFixed(2) : '-' }}</td>
            <td>{{ c.difference != null ? '$' + c.difference.toFixed(2) : '-' }}</td>
            <td>
              <p-tag [value]="c.status === 'ABIERTO' ? 'Abierto' : 'Cerrado'"
                [severity]="c.status === 'ABIERTO' ? 'success' : 'info'"></p-tag>
            </td>
            <td>{{ c.openedAt | date:'dd/MM/yyyy HH:mm' }}<br/><small>{{ c.openedBy }}</small></td>
            <td>{{ c.closedAt ? (c.closedAt | date:'dd/MM/yyyy HH:mm') : '-' }}<br/><small>{{ c.closedBy || '' }}</small></td>
            <td>
              <p-button *ngIf="c.status === 'ABIERTO'" icon="pi pi-check-circle"
                label="Cerrar" severity="warning" (onClick)="showCloseDialog(c)" pTooltip="Cerrar corte"></p-button>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr><td colspan="11" class="text-center">No hay cortes de caja registrados</td></tr>
        </ng-template>
      </p-table>
    </p-card>

    <p-dialog [(visible)]="openDialogVisible" header="Abrir corte de caja" [modal]="true" [style]="{width: '400px'}">
      <div class="field">
        <label>Efectivo inicial</label>
        <p-inputNumber [(ngModel)]="initialCash" [min]="0" [step]="0.01" mode="currency" currency="USD" styleClass="full-width"></p-inputNumber>
      </div>
      <div class="field">
        <label>Notas (opcional)</label>
        <input type="text" pInputText [(ngModel)]="openNotes" class="full-width" placeholder="Notas..." />
      </div>
      <div class="dialog-footer">
        <p-button label="Cancelar" severity="secondary" (onClick)="openDialogVisible = false" styleClass="p-button-text"></p-button>
        <p-button label="Abrir" (onClick)="openClosure()" [loading]="saving"></p-button>
      </div>
    </p-dialog>

    <p-dialog [(visible)]="closeDialogVisible" [header]="'Cerrar corte #' + closingClosure?.id" [modal]="true" [style]="{width: '450px'}">
      <div class="summary-info" *ngIf="closingClosure">
        <div class="summary-row"><span>Efectivo inicial:</span><span>\${{ closingClosure.initialCash.toFixed(2) }}</span></div>
        <div class="summary-row"><span>Total ventas:</span><span>\${{ closingClosure.totalSales.toFixed(2) }}</span></div>
        <div class="summary-row"><span>Total gastos:</span><span>-\${{ closingClosure.totalExpenses.toFixed(2) }}</span></div>
        <div class="summary-row total"><span>Efectivo esperado:</span><span>\${{ closingClosure.expectedCash.toFixed(2) }}</span></div>
      </div>
      <div class="field">
        <label>Efectivo declarado</label>
        <p-inputNumber [(ngModel)]="declaredCash" [min]="0" [step]="0.01" mode="currency" currency="USD" styleClass="full-width"></p-inputNumber>
      </div>
      <div class="field">
        <label>Notas (opcional)</label>
        <input type="text" pInputText [(ngModel)]="closeNotes" class="full-width" placeholder="Notas..." />
      </div>
      <div class="dialog-footer">
        <p-button label="Cancelar" severity="secondary" (onClick)="closeDialogVisible = false" styleClass="p-button-text"></p-button>
        <p-button label="Cerrar corte" severity="warning" (onClick)="closeClosure()" [loading]="saving"></p-button>
      </div>
    </p-dialog>

    <p-dialog [(visible)]="summaryDialogVisible" header="Resumen por período" [modal]="true" [style]="{width: '500px'}">
      <div class="field">
        <label>Fecha inicio</label>
        <input type="date" [(ngModel)]="summaryStart" class="full-width" pInputText />
      </div>
      <div class="field">
        <label>Fecha fin</label>
        <input type="date" [(ngModel)]="summaryEnd" class="full-width" pInputText />
      </div>
      <div class="dialog-footer">
        <p-button label="Cancelar" severity="secondary" (onClick)="summaryDialogVisible = false" styleClass="p-button-text"></p-button>
        <p-button label="Consultar" (onClick)="loadSummary()" [loading]="loadingSummary"></p-button>
      </div>
      <div *ngIf="summaryData" class="summary-result">
        <h3>Resultado</h3>
        <div class="summary-row"><span>Ventas totales:</span><span>\${{ summaryData.totalSales?.toFixed(2) }}</span></div>
        <div class="summary-row"><span>Gastos totales:</span><span>-\${{ summaryData.totalExpenses?.toFixed(2) }}</span></div>
        <div class="summary-row total"><span>Neto:</span><span>\${{ (summaryData.totalSales - summaryData.totalExpenses).toFixed(2) }}</span></div>
      </div>
    </p-dialog>

    <p-toast></p-toast>
  `,
  styles: [`
    .toolbar { margin-bottom: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .field { margin-bottom: 1.25rem; }
    .field label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .full-width { width: 100%; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
    .summary-info { background: var(--surface-ground); padding: 1rem; border-radius: 6px; margin-bottom: 1rem; }
    .summary-row { display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.95rem; }
    .summary-row.total { border-top: 1px solid var(--surface-border); margin-top: 0.25rem; padding-top: 0.5rem; font-weight: 700; font-size: 1.05rem; }
    .summary-result { margin-top: 1.5rem; padding: 1rem; background: var(--surface-ground); border-radius: 6px; }
    .summary-result h3 { margin: 0 0 0.75rem 0; font-size: 1rem; }
  `]
})
export class CashClosureComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  closures: CashClosure[] = [];
  openDialogVisible = false;
  closeDialogVisible = false;
  summaryDialogVisible = false;
  saving = false;
  loadingSummary = false;

  initialCash = 0;
  openNotes = '';
  declaredCash = 0;
  closeNotes = '';
  closingClosure: CashClosure | null = null;

  summaryStart = '';
  summaryEnd = '';
  summaryData: any = null;

  ngOnInit(): void {
    this.loadClosures();
  }

  loadClosures(): void {
    this.api.getCashClosures().subscribe({
      next: (data) => { this.closures = data; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los cortes' });
      },
    });
  }

  showOpenDialog(): void {
    this.initialCash = 0;
    this.openNotes = '';
    this.openDialogVisible = true;
  }

  openClosure(): void {
    this.saving = true;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const payload = {
      openedAt: startOfDay.toISOString(),
      closedAt: now.toISOString(),
      openedBy: this.authService.getUsername(),
      initialCash: this.initialCash,
      notes: this.openNotes,
    };
    this.api.openCashClosure(payload).subscribe({
      next: () => {
        this.saving = false;
        this.openDialogVisible = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Corte abierto correctamente' });
        this.loadClosures();
      },
      error: (err) => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'No se pudo abrir el corte' });
      },
    });
  }

  showCloseDialog(closure: CashClosure): void {
    this.closingClosure = closure;
    this.declaredCash = closure.expectedCash;
    this.closeNotes = '';
    this.closeDialogVisible = true;
  }

  closeClosure(): void {
    if (!this.closingClosure) return;
    this.saving = true;
    const payload = {
      closedAt: new Date().toISOString(),
      closedBy: this.authService.getUsername(),
      declaredCash: this.declaredCash,
      notes: this.closeNotes,
    };
    this.api.closeCashClosure(this.closingClosure.id, payload).subscribe({
      next: () => {
        this.saving = false;
        this.closeDialogVisible = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Corte cerrado correctamente' });
        this.loadClosures();
      },
      error: (err) => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'No se pudo cerrar el corte' });
      },
    });
  }

  showSummaryDialog(): void {
    const today = new Date().toISOString().split('T')[0];
    const firstDay = new Date();
    firstDay.setDate(1);
    this.summaryStart = firstDay.toISOString().split('T')[0];
    this.summaryEnd = today;
    this.summaryData = null;
    this.summaryDialogVisible = true;
  }

  loadSummary(): void {
    if (!this.summaryStart || !this.summaryEnd) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Seleccione fecha inicio y fin' });
      return;
    }
    this.loadingSummary = true;
    this.api.getCashClosureSummary(this.summaryStart, this.summaryEnd).subscribe({
      next: (data) => {
        this.loadingSummary = false;
        this.summaryData = data;
      },
      error: () => {
        this.loadingSummary = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el resumen' });
      },
    });
  }
}
