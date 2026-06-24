import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

import { ApiService } from '../../core/services/api.service';
import { Client } from '../../core/models/auth.models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [FormsModule, NgFor, ButtonModule, InputTextModule, TableModule, DialogModule, CardModule],
  template: `
        <h1>Clientes</h1>
        <div class="toolbar">
          <p-button label="Nuevo cliente" icon="pi pi-plus" (onClick)="showDialog()"></p-button>
        </div>
        <p-card>
          <p-table [value]="clients" [paginator]="true" [rows]="15" styleClass="p-datatable-sm" [globalFilterFields]="['name','phone','email']">
            <ng-template pTemplate="header">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Puntos</th>
                <th>Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-client>
              <tr>
                <td>{{ client.id }}</td>
                <td>{{ client.name }}</td>
                <td>{{ client.phone }}</td>
                <td>{{ client.email || '-' }}</td>
                <td>{{ client.loyaltyPoints }}</td>
                <td>
                  <p-button icon="pi pi-pencil" (onClick)="editClient(client)" pTooltip="Editar"></p-button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>

        <p-dialog [(visible)]="dialogVisible" [header]="editingClient ? 'Editar cliente' : 'Nuevo cliente'" [modal]="true">
          <div class="field">
            <label>Nombre</label>
            <input type="text" pInputText [(ngModel)]="formData.name" class="full-width" />
          </div>
          <div class="field">
            <label>Teléfono</label>
            <input type="text" pInputText [(ngModel)]="formData.phone" class="full-width" />
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" pInputText [(ngModel)]="formData.email" class="full-width" />
          </div>
          <p-button label="Guardar" (onClick)="saveClient()" styleClass="full-width"></p-button>
        </p-dialog>
  `,
  styles: [`
    .toolbar { margin-bottom: 1rem; }
    .field { margin-bottom: 1rem; }
    .full-width { width: 100%; }
  `]
})
export class ClientsComponent implements OnInit {
  private readonly api = inject(ApiService);
  clients: Client[] = [];
  dialogVisible = false;
  editingClient: Client | null = null;
  formData = { name: '', phone: '', email: '' };

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.api.getClients().subscribe(data => { this.clients = data; });
  }

  showDialog(): void {
    this.editingClient = null;
    this.formData = { name: '', phone: '', email: '' };
    this.dialogVisible = true;
  }

  editClient(client: Client): void {
    this.editingClient = client;
    this.formData = { name: client.name, phone: client.phone, email: client.email || '' };
    this.dialogVisible = true;
  }

  saveClient(): void {
    if (this.editingClient) {
      this.api.updateClient(this.editingClient.id, this.formData).subscribe(() => {
        this.dialogVisible = false;
        this.loadClients();
      });
    } else {
      this.api.createClient(this.formData).subscribe(() => {
        this.dialogVisible = false;
        this.loadClients();
      });
    }
  }
}
