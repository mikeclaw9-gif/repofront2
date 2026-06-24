import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { ApiService } from '../../core/services/api.service';
import { ServiceType } from '../../core/models/auth.models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, ButtonModule, InputTextModule,
    InputNumberModule, TableModule, DialogModule, CardModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
        <h1>Servicios</h1>
        <div class="toolbar">
          <p-button label="Nuevo servicio" icon="pi pi-plus" (onClick)="showDialog()"></p-button>
        </div>
        <p-card>
          <p-table [value]="services" [paginator]="true" [rows]="15" styleClass="p-datatable-sm" [globalFilterFields]="['name']">
            <ng-template pTemplate="header">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio por kg</th>
                <th>Tiempo estimado</th>
                <th>Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-service>
              <tr>
                <td>{{ service.id }}</td>
                <td>{{ service.name }}</td>
                <td>\${{ service.pricePerKg.toFixed(2) }}</td>
                <td>{{ service.estimatedTimeMinutes }} min</td>
                <td>
                  <p-button icon="pi pi-pencil" (onClick)="editService(service)" pTooltip="Editar" class="mr-1"></p-button>
                  <p-button icon="pi pi-trash" severity="danger" (onClick)="confirmDelete(service)" pTooltip="Eliminar"></p-button>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="5" class="text-center">No hay servicios registrados</td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>

        <p-dialog [(visible)]="dialogVisible" [header]="editingService ? 'Editar servicio' : 'Nuevo servicio'" [modal]="true" [style]="{width: '90vw'}" [maximizable]="false" [dismissableMask]="true">
          <div class="field">
            <label for="name">Nombre del servicio</label>
            <input id="name" type="text" pInputText [(ngModel)]="formData.name" class="full-width" placeholder="Ej: Lavado Normal" />
          </div>
          <div class="field">
            <label for="pricePerKg">Precio por kg (\$)</label>
            <p-inputNumber id="pricePerKg" [(ngModel)]="formData.pricePerKg" [min]="0" [step]="0.5" mode="currency" currency="USD" styleClass="full-width"></p-inputNumber>
          </div>
          <div class="field">
            <label for="estimatedTime">Tiempo estimado (minutos)</label>
            <p-inputNumber id="estimatedTime" [(ngModel)]="formData.estimatedTimeMinutes" [min]="0" [step]="15" styleClass="full-width"></p-inputNumber>
          </div>
          <div class="dialog-footer">
            <p-button label="Cancelar" severity="secondary" (onClick)="dialogVisible = false" styleClass="p-button-text"></p-button>
            <p-button label="Guardar" (onClick)="saveService()" [loading]="saving"></p-button>
          </div>
        </p-dialog>

        <p-confirmDialog></p-confirmDialog>
        <p-toast></p-toast>
  `,
  styles: [`
    .toolbar { margin-bottom: 1rem; }
    .field { margin-bottom: 1.25rem; }
    .field label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .full-width { width: 100%; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
    .mr-1 { margin-right: 0.25rem; }
    :host ::ng-deep .p-inputnumber { width: 100%; }
  `]
})
export class ServiciosComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  services: ServiceType[] = [];
  dialogVisible = false;
  editingService: ServiceType | null = null;
  saving = false;
  formData = { name: '', pricePerKg: 0, estimatedTimeMinutes: 0 };

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.api.getServiceTypes().subscribe({
      next: (data) => { this.services = data; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los servicios' });
      },
    });
  }

  showDialog(): void {
    this.editingService = null;
    this.formData = { name: '', pricePerKg: 0, estimatedTimeMinutes: 0 };
    this.dialogVisible = true;
  }

  editService(service: ServiceType): void {
    this.editingService = service;
    this.formData = { name: service.name, pricePerKg: service.pricePerKg, estimatedTimeMinutes: service.estimatedTimeMinutes };
    this.dialogVisible = true;
  }

  saveService(): void {
    if (!this.formData.name.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'El nombre del servicio es obligatorio' });
      return;
    }
    if (this.formData.pricePerKg <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'El precio debe ser mayor a cero' });
      return;
    }

    this.saving = true;
    if (this.editingService) {
      this.api.updateServiceType(this.editingService.id, this.formData).subscribe({
        next: () => {
          this.saving = false;
          this.dialogVisible = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio actualizado correctamente' });
          this.loadServices();
        },
        error: () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el servicio' });
        },
      });
    } else {
      this.api.createServiceType(this.formData).subscribe({
        next: () => {
          this.saving = false;
          this.dialogVisible = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio creado correctamente' });
          this.loadServices();
        },
        error: () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el servicio' });
        },
      });
    }
  }

  confirmDelete(service: ServiceType): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el servicio "${service.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteService(service.id),
    });
  }

  deleteService(id: number): void {
    this.api.deleteServiceType(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Servicio eliminado correctamente' });
        this.loadServices();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el servicio' });
      },
    });
  }
}
