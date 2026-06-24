import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';

import { ApiService } from '../../core/services/api.service';
import { Expense } from '../../core/models/auth.models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass, DatePipe, ButtonModule, InputTextModule,
    InputNumberModule, TableModule, DialogModule, CardModule, DropdownModule,
    CalendarModule, TagModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
        <h1>Gastos</h1>
        <div class="toolbar">
          <p-button label="Nuevo gasto" icon="pi pi-plus" (onClick)="showDialog()"></p-button>
          <span class="toolbar-spacer"></span>
          <input type="text" pInputText [(ngModel)]="searchQuery" placeholder="Buscar por descripción..." class="search-input" (input)="onSearch()" />
        </div>
        <p-card>
          <p-table [value]="expenses" [paginator]="true" [rows]="15" styleClass="p-datatable-sm">
            <ng-template pTemplate="header">
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-expense>
              <tr>
                <td>{{ expense.id }}</td>
                <td>{{ expense.description }}</td>
                <td><p-tag [value]="expense.category" severity="info"></p-tag></td>
                <td>\${{ expense.amount.toFixed(2) }}</td>
                <td>{{ expense.expenseDate | date:'dd/MM/yyyy' }}</td>
                <td>
                  <p-button icon="pi pi-pencil" (onClick)="editExpense(expense)" pTooltip="Editar" class="mr-1"></p-button>
                  <p-button icon="pi pi-trash" severity="danger" (onClick)="confirmDelete(expense)" pTooltip="Eliminar"></p-button>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="6" class="text-center">No hay gastos registrados</td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>

        <p-dialog [(visible)]="dialogVisible" [header]="editingExpense ? 'Editar gasto' : 'Nuevo gasto'" [modal]="true" [style]="{width: '90vw'}" [maximizable]="false" [dismissableMask]="true">
          <div class="field">
            <label>Descripción</label>
            <input type="text" pInputText [(ngModel)]="formData.description" class="full-width" placeholder="Ej: Compra de jabón" />
          </div>
          <div class="field">
            <label>Categoría</label>
            <p-dropdown [(ngModel)]="formData.category" [options]="categories" styleClass="full-width" placeholder="Seleccionar categoría"></p-dropdown>
          </div>
          <div class="field">
            <label>Monto</label>
            <p-inputNumber [(ngModel)]="formData.amount" [min]="0" [step]="0.01" mode="currency" currency="USD" styleClass="full-width"></p-inputNumber>
          </div>
          <div class="field">
            <label>Método de pago</label>
            <p-dropdown [(ngModel)]="formData.paymentMethod" [options]="paymentMethods" styleClass="full-width" placeholder="Seleccionar método"></p-dropdown>
          </div>
          <div class="field">
            <label>Fecha del gasto</label>
            <p-calendar [(ngModel)]="formData.expenseDate" [showTime]="true" dateFormat="yy-mm-dd" [showIcon]="true" styleClass="full-width"></p-calendar>
          </div>
          <div class="field">
            <label>Notas (opcional)</label>
            <input type="text" pInputText [(ngModel)]="formData.notes" class="full-width" placeholder="Notas adicionales..." />
          </div>
          <div class="dialog-footer">
            <p-button label="Cancelar" severity="secondary" (onClick)="dialogVisible = false" styleClass="p-button-text"></p-button>
            <p-button label="Guardar" (onClick)="saveExpense()" [loading]="saving"></p-button>
          </div>
        </p-dialog>

        <p-confirmDialog></p-confirmDialog>
        <p-toast></p-toast>
  `,
  styles: [`
    .toolbar { margin-bottom: 1rem; display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
    .toolbar-spacer { flex: 1; }
    .search-input { max-width: 300px; }
    .field { margin-bottom: 1.25rem; }
    .field label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .full-width { width: 100%; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
    .mr-1 { margin-right: 0.25rem; }
  `]
})
export class ExpensesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  expenses: Expense[] = [];
  dialogVisible = false;
  editingExpense: Expense | null = null;
  saving = false;
  searchQuery = '';

  categories = [
    { label: 'Alquiler', value: 'ALQUILER' },
    { label: 'Servicios', value: 'SERVICIOS' },
    { label: 'Insumos', value: 'INSUMOS' },
    { label: 'Mantenimiento', value: 'MANTENIMIENTO' },
    { label: 'Nómina', value: 'NOMINA' },
    { label: 'Otros', value: 'OTROS' },
  ];

  paymentMethods = [
    { label: 'Efectivo', value: 'EFECTIVO' },
    { label: 'Transferencia', value: 'TRANSFERENCIA' },
    { label: 'Tarjeta', value: 'TARJETA' },
  ];

  formData = { description: '', category: '', amount: 0, paymentMethod: 'EFECTIVO', expenseDate: new Date(), notes: '' };

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.api.getExpenses().subscribe({
      next: (data) => { this.expenses = data; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los gastos' });
      },
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.loadExpenses();
      return;
    }
    this.api.searchExpenses(this.searchQuery.trim()).subscribe({
      next: (data) => { this.expenses = data; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al buscar gastos' });
      },
    });
  }

  showDialog(): void {
    this.editingExpense = null;
    this.formData = { description: '', category: '', amount: 0, paymentMethod: 'EFECTIVO', expenseDate: new Date(), notes: '' };
    this.dialogVisible = true;
  }

  editExpense(expense: Expense): void {
    this.editingExpense = expense;
    this.formData = {
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
      paymentMethod: expense.paymentMethod,
      expenseDate: new Date(expense.expenseDate),
      notes: expense.notes || '',
    };
    this.dialogVisible = true;
  }

  saveExpense(): void {
    if (!this.formData.description.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'La descripción es obligatoria' });
      return;
    }
    if (!this.formData.category) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Seleccione una categoría' });
      return;
    }
    if (this.formData.amount <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'El monto debe ser mayor a cero' });
      return;
    }

    this.saving = true;
    const payload = {
      description: this.formData.description,
      category: this.formData.category,
      amount: this.formData.amount,
      paymentMethod: this.formData.paymentMethod,
      expenseDate: this.formData.expenseDate instanceof Date
        ? this.formData.expenseDate.toISOString()
        : this.formData.expenseDate,
      notes: this.formData.notes,
    };
    console.log('Payload a enviar:', JSON.stringify(payload));

    if (this.editingExpense) {
      this.api.updateExpense(this.editingExpense.id, payload).subscribe({
        next: () => {
          this.saving = false;
          this.dialogVisible = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Gasto actualizado correctamente' });
          this.loadExpenses();
        },
        error: (err) => {
          this.saving = false;
          console.error('Error al actualizar gasto', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || err.statusText || 'No se pudo actualizar el gasto' });
        },
      });
    } else {
      this.api.createExpense(payload).subscribe({
        next: () => {
          this.saving = false;
          this.dialogVisible = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Gasto creado correctamente' });
          this.loadExpenses();
        },
        error: (err) => {
          this.saving = false;
          console.error('Error al crear gasto', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || err.statusText || 'No se pudo crear el gasto' });
        },
      });
    }
  }

  confirmDelete(expense: Expense): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el gasto "${expense.description}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteExpense(expense.id),
    });
  }

  deleteExpense(id: number): void {
    this.api.deleteExpense(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Gasto eliminado correctamente' });
        this.loadExpenses();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el gasto' });
      },
    });
  }
}
