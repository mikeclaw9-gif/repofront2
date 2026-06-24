import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { ApiService } from '../../core/services/api.service';
import { Product } from '../../core/models/auth.models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, ButtonModule, InputTextModule,
    InputNumberModule, TableModule, DialogModule, CardModule, TagModule],
  template: `
        <h1>Inventario</h1>
        <div class="toolbar">
          <p-button label="Nuevo producto" icon="pi pi-plus" (onClick)="showDialog()"></p-button>
          <p-button label="Alertas bajo stock" icon="pi pi-exclamation-triangle" severity="warning" (onClick)="showLowStock()"></p-button>
        </div>
        <p-card>
          <p-table [value]="products" [paginator]="true" [rows]="15" styleClass="p-datatable-sm">
            <ng-template pTemplate="header">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Stock mín.</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-product>
              <tr>
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.category }}</td>
                <td>\${{ product.price.toFixed(2) }}</td>
                <td>{{ product.stock }}</td>
                <td>{{ product.minStock }}</td>
                <td>
                  <p-tag *ngIf="product.lowStock" value="Stock bajo" severity="danger"></p-tag>
                  <p-tag *ngIf="!product.lowStock" value="Normal" severity="success"></p-tag>
                </td>
                <td>
                  <p-button icon="pi pi-pencil" (onClick)="editProduct(product)" pTooltip="Editar"></p-button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>

        <p-dialog [(visible)]="dialogVisible" [header]="editingProduct ? 'Editar producto' : 'Nuevo producto'" [modal]="true">
          <div class="field">
            <label>Nombre</label>
            <input type="text" pInputText [(ngModel)]="formData.name" class="full-width" />
          </div>
          <div class="field">
            <label>Categoría</label>
            <input type="text" pInputText [(ngModel)]="formData.category" class="full-width" />
          </div>
          <div class="field">
            <label>Precio</label>
            <p-inputNumber [(ngModel)]="formData.price" [min]="0" [step]="0.01" mode="currency" currency="USD" styleClass="full-width"></p-inputNumber>
          </div>
          <div class="field">
            <label>Stock</label>
            <p-inputNumber [(ngModel)]="formData.stock" [min]="0" styleClass="full-width"></p-inputNumber>
          </div>
          <div class="field">
            <label>Stock mínimo</label>
            <p-inputNumber [(ngModel)]="formData.minStock" [min]="0" styleClass="full-width"></p-inputNumber>
          </div>
          <p-button label="Guardar" (onClick)="saveProduct()" styleClass="full-width"></p-button>
        </p-dialog>
  `,
  styles: [`
    .toolbar { margin-bottom: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .field { margin-bottom: 1rem; }
    .full-width { width: 100%; }
  `]
})
export class InventoryComponent implements OnInit {
  private readonly api = inject(ApiService);
  products: Product[] = [];
  dialogVisible = false;
  editingProduct: Product | null = null;
  formData = { name: '', category: '', price: 0, stock: 0, minStock: 0 };

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.api.getProducts().subscribe(data => { this.products = data; });
  }

  showDialog(): void {
    this.editingProduct = null;
    this.formData = { name: '', category: '', price: 0, stock: 0, minStock: 0 };
    this.dialogVisible = true;
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.formData = {
      name: product.name, category: product.category,
      price: product.price, stock: product.stock, minStock: product.minStock,
    };
    this.dialogVisible = true;
  }

  saveProduct(): void {
    if (this.editingProduct) {
      this.api.updateProduct(this.editingProduct.id, this.formData).subscribe(() => {
        this.dialogVisible = false;
        this.loadProducts();
      });
    } else {
      this.api.createProduct(this.formData).subscribe(() => {
        this.dialogVisible = false;
        this.loadProducts();
      });
    }
  }

  showLowStock(): void {
    this.api.getLowStockAlerts().subscribe(data => { this.products = data; });
  }
}
