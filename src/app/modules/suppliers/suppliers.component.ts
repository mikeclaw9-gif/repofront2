import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

import { ApiService } from '../../core/services/api.service';
import { Supplier } from '../../core/models/auth.models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [FormsModule, NgFor, ButtonModule, InputTextModule, TableModule, DialogModule, CardModule],
  template: `
        <h1>Proveedores</h1>
        <div class="toolbar">
          <p-button label="Nuevo proveedor" icon="pi pi-plus" (onClick)="showDialog()"></p-button>
        </div>
        <p-card>
          <p-table [value]="suppliers" [paginator]="true" [rows]="15" styleClass="p-datatable-sm">
            <ng-template pTemplate="header">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-supplier>
              <tr>
                <td>{{ supplier.id }}</td>
                <td>{{ supplier.name }}</td>
                <td>{{ supplier.contactName || '-' }}</td>
                <td>{{ supplier.phone }}</td>
                <td>{{ supplier.email || '-' }}</td>
                <td>{{ supplier.address || '-' }}</td>
                <td>
                  <p-button icon="pi pi-pencil" (onClick)="editSupplier(supplier)" pTooltip="Editar"></p-button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>

        <p-dialog [(visible)]="dialogVisible" [header]="editingSupplier ? 'Editar proveedor' : 'Nuevo proveedor'" [modal]="true">
          <div class="field">
            <label>Nombre</label>
            <input type="text" pInputText [(ngModel)]="formData.name" class="full-width" />
          </div>
          <div class="field">
            <label>Nombre de contacto</label>
            <input type="text" pInputText [(ngModel)]="formData.contactName" class="full-width" />
          </div>
          <div class="field">
            <label>Teléfono</label>
            <input type="text" pInputText [(ngModel)]="formData.phone" class="full-width" />
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" pInputText [(ngModel)]="formData.email" class="full-width" />
          </div>
          <div class="field">
            <label>Dirección</label>
            <input type="text" pInputText [(ngModel)]="formData.address" class="full-width" />
          </div>
          <p-button label="Guardar" (onClick)="saveSupplier()" styleClass="full-width"></p-button>
        </p-dialog>
  `,
  styles: [`
    .toolbar { margin-bottom: 1rem; }
    .field { margin-bottom: 1rem; }
    .full-width { width: 100%; }
  `]
})
export class SuppliersComponent implements OnInit {
  private readonly api = inject(ApiService);
  suppliers: Supplier[] = [];
  dialogVisible = false;
  editingSupplier: Supplier | null = null;
  formData = { name: '', contactName: '', phone: '', email: '', address: '' };

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.api.getSuppliers().subscribe(data => { this.suppliers = data; });
  }

  showDialog(): void {
    this.editingSupplier = null;
    this.formData = { name: '', contactName: '', phone: '', email: '', address: '' };
    this.dialogVisible = true;
  }

  editSupplier(supplier: Supplier): void {
    this.editingSupplier = supplier;
    this.formData = {
      name: supplier.name, contactName: supplier.contactName || '',
      phone: supplier.phone, email: supplier.email || '', address: supplier.address || '',
    };
    this.dialogVisible = true;
  }

  saveSupplier(): void {
    if (this.editingSupplier) {
      this.api.updateSupplier(this.editingSupplier.id, this.formData).subscribe(() => {
        this.dialogVisible = false;
        this.loadSuppliers();
      });
    } else {
      this.api.createSupplier(this.formData).subscribe(() => {
        this.dialogVisible = false;
        this.loadSuppliers();
      });
    }
  }
}
