import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { ApiService } from '../../core/services/api.service';
import { ServiceType } from '../../core/models/auth.models';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, ButtonModule, InputNumberModule,
    InputTextModule, DropdownModule, CardModule, TableModule, TagModule, AutoCompleteModule,
    ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
        <h1>Punto de Venta</h1>
        <div class="pos-grid">
          <div class="pos-form">
            <p-card header="Nueva Orden">
              <div class="field">
                <label>Cliente</label>
                <p-autoComplete [(ngModel)]="selectedClient" [suggestions]="filteredClients"
                  (completeMethod)="searchClient($event)" field="name" placeholder="Buscar cliente..."
                  [dropdown]="true" styleClass="full-width"></p-autoComplete>
              </div>

              <h3>Servicios de Lavandería</h3>
              <div *ngFor="let item of orderItems; let i = index" class="service-row">
                <p-dropdown [(ngModel)]="item.service" [options]="serviceTypes"
                  optionLabel="name" placeholder="Tipo de servicio"
                  styleClass="full-width"></p-dropdown>
                <p-inputNumber [(ngModel)]="item.weight" [min]="0" [step]="0.5" suffix=" kg"
                  placeholder="Peso" styleClass="full-width"></p-inputNumber>
                <span *ngIf="item.service" class="item-subtotal">\${{ item.service.pricePerKg.toFixed(2) }}/kg</span>
                <p-button icon="pi pi-trash" severity="danger" (onClick)="removeItem(i)"></p-button>
              </div>
              <p-button label="Agregar servicio" (onClick)="addItem()" styleClass="p-button-text"></p-button>

              <h3>Productos</h3>
              <div *ngFor="let prod of selectedProducts; let i = index" class="product-row">
                <p-dropdown [(ngModel)]="prod.productId" [options]="products"
                  optionLabel="name" optionValue="id" placeholder="Producto"
                  styleClass="full-width"></p-dropdown>
                <p-inputNumber [(ngModel)]="prod.quantity" [min]="1" placeholder="Cant."
                  styleClass="full-width"></p-inputNumber>
                <span *ngIf="prod.productId" class="item-subtotal">\${{ getProductPrice(prod.productId, prod.quantity).toFixed(2) }}</span>
                <p-button icon="pi pi-trash" severity="danger" (onClick)="removeProduct(i)"></p-button>
              </div>
              <p-button label="Agregar producto" (onClick)="addProduct()" styleClass="p-button-text"></p-button>

              <div class="total-section">
                <h2>Total: \${{ calculateTotal().toFixed(2) }}</h2>
                <div class="btn-group">
                  <p-button label="Limpiar" icon="pi pi-refresh" severity="secondary"
                    (onClick)="resetForm()" styleClass="p-button-outlined"></p-button>
                  <p-button label="Generar orden" icon="pi pi-check" (onClick)="createOrder()" [loading]="loading"
                    styleClass="p-button-success"></p-button>
                </div>
              </div>
            </p-card>
          </div>

          <div class="pos-orders">
            <p-card header="Órdenes activas">
              <div class="search-bar">
                <input #ticketInput type="text" pInputText [(ngModel)]="searchTicketId" placeholder="Buscar por # ticket..." class="search-input" />
                <p-button icon="pi pi-camera" (onClick)="startScanner()" pTooltip="Escanear código QR/barras" styleClass="p-button-outlined"></p-button>
                <input #cameraInput type="file" accept="image/*" capture="environment" (change)="onImageCaptured($event)" style="display:none" />
              </div>
              <p-table [value]="filteredOrders" [paginator]="true" [rows]="10" styleClass="p-datatable-sm">
                <ng-template pTemplate="header">
                  <tr>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-order>
                  <tr>
                    <td>{{ order.id }}</td>
                    <td>{{ order.clientName || '-' }}</td>
                    <td>\${{ order.totalAmount.toFixed(2) }}</td>
                    <td><p-tag [value]="order.status" [severity]="getStatusSeverity(order.status)"></p-tag></td>
                    <td>
                      <p-button icon="pi pi-print" (onClick)="printTicket(order)" pTooltip="Imprimir ticket" class="mr-1"></p-button>
                      <p-button icon="pi pi-refresh" (onClick)="updateStatus(order.id, 'EN_PROCESO')" pTooltip="En proceso" class="mr-1"></p-button>
                      <p-button icon="pi pi-check" (onClick)="updateStatus(order.id, 'LISTO')" pTooltip="Listo" class="mr-1"></p-button>
                      <p-button icon="pi pi-trash" severity="danger" (onClick)="confirmDeleteOrder(order)" pTooltip="Cancelar orden"></p-button>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </p-card>
          </div>
        </div>

        <p-confirmDialog></p-confirmDialog>
        <p-toast></p-toast>
  `,
  styles: [`
    .pos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .field { margin-bottom: 1rem; }
    .service-row, .product-row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
    .service-row > *, .product-row > * { min-width: 0; }
    .item-subtotal { font-size: 0.875rem; font-weight: 600; color: var(--primary-color); white-space: nowrap; min-width: 70px; text-align: right; }
    .total-section { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--surface-border); }
    .total-section h2 { margin: 0 0 1rem 0; }
    .btn-group { display: flex; gap: 0.5rem; }
    .btn-group p-button { flex: 1; }
    .full-width { width: 100%; }
    .mr-1 { margin-right: 0.25rem; }
    :host ::ng-deep .p-autocomplete { width: 100%; }
    .search-bar { display: flex; gap: 0.5rem; margin-bottom: 1rem; align-items: center; }
    .search-input { flex: 1; }
    @media (max-width: 767px) {
      .pos-grid { grid-template-columns: 1fr; }
      .service-row, .product-row { flex-wrap: wrap; }
      .service-row > *, .product-row > * { flex: 1 1 100%; }
    }
  `]
})
export class PosComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  serviceTypes: ServiceType[] = [];
  products: any[] = [];
  clients: any[] = [];
  filteredClients: any[] = [];
  selectedClient: any = null;
  @ViewChild('cameraInput') cameraInput!: ElementRef<HTMLInputElement>;
  activeOrders: any[] = [];
  searchTicketId = '';
  get pendingOrders(): any[] {
    return this.activeOrders.filter(o => o.status !== 'LISTO');
  }
  get filteredOrders(): any[] {
    if (!this.searchTicketId) return this.pendingOrders;
    const q = this.searchTicketId.toString().trim();
    return this.pendingOrders.filter(o => o.id.toString().includes(q));
  }
  loading = false;

  orderItems: Array<{ service: ServiceType | null; weight: number }> = [];
  selectedProducts: Array<{ productId: number | null; quantity: number }> = [];

  ngOnInit(): void {
    this.api.getServiceTypes().subscribe(data => { this.serviceTypes = data; });
    this.api.getProducts().subscribe(data => { this.products = data; });
    this.api.getClients().subscribe(data => { this.clients = data; });
    this.loadActiveOrders();
  }

  startScanner(): void {
    this.cameraInput.nativeElement.value = '';
    this.cameraInput.nativeElement.click();
  }

  onImageCaptured(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!('BarcodeDetector' in window)) {
      this.messageService.add({ severity: 'warn', summary: 'No disponible', detail: 'El lector de códigos no está disponible en este navegador' });
      return;
    }

    const img = new Image();
    img.onload = () => {
      const detector = new (window as any).BarcodeDetector({
        formats: ['code_128', 'qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e'],
      });
      detector.detect(img).then((barcodes: any[]) => {
        if (barcodes.length > 0) {
          this.searchTicketId = barcodes[0].rawValue;
          this.messageService.add({ severity: 'success', summary: 'Código leído', detail: `Ticket #${barcodes[0].rawValue} detectado` });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Sin resultados', detail: 'No se pudo leer ningún código de la imagen' });
        }
      }).catch(() => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al procesar la imagen del código' });
      });
    };
    img.src = URL.createObjectURL(file);
  }

  loadActiveOrders(): void {
    this.api.getActiveOrders().subscribe({
      next: (data) => { this.activeOrders = data; },
      error: () => { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las órdenes' }); },
    });
  }

  searchClient(event: any): void {
    const q = event.query.toLowerCase();
    this.filteredClients = this.clients.filter(c =>
      c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q))
    );
  }

  getProductPrice(productId: number | null, quantity: number): number {
    if (!productId) return 0;
    const p = this.products.find(p => p.id === productId);
    return p ? p.price * quantity : 0;
  }

  addItem(): void {
    this.orderItems.push({ service: null, weight: 0 });
  }

  removeItem(index: number): void {
    this.orderItems.splice(index, 1);
  }

  addProduct(): void {
    this.selectedProducts.push({ productId: null, quantity: 1 });
  }

  removeProduct(index: number): void {
    this.selectedProducts.splice(index, 1);
  }

  resetForm(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de limpiar la orden actual? Se perderán todos los datos ingresados.',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Limpiar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.orderItems = [];
        this.selectedProducts = [];
        this.selectedClient = null;
        this.messageService.add({ severity: 'info', summary: 'Orden limpiada', detail: 'La orden se ha reiniciado' });
      },
    });
  }

  calculateTotal(): number {
    let total = 0;
    for (const item of this.orderItems) {
      if (item.service) total += item.service.pricePerKg * item.weight;
    }
    for (const prod of this.selectedProducts) {
      if (!prod.productId) continue;
      const p = this.products.find(p => p.id === prod.productId);
      if (p) total += p.price * prod.quantity;
    }
    return total;
  }

  createOrder(): void {
    if (this.orderItems.length === 0 && this.selectedProducts.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Orden vacía', detail: 'Agregue al menos un servicio o producto' });
      return;
    }

    this.loading = true;
    const payload = {
      clientId: this.selectedClient?.id || null,
      userId: 1,
      items: this.orderItems.map(i => ({ serviceTypeId: i.service?.id, weight: i.weight })),
      products: this.selectedProducts.map(p => ({ productId: p.productId, quantity: p.quantity })),
    };
    this.api.createServiceOrder(payload).subscribe({
      next: (order) => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Orden creada', detail: `Orden #${order.id} generada correctamente` });
        this.orderItems = [];
        this.selectedProducts = [];
        this.selectedClient = null;
        this.loadActiveOrders();
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la orden' });
      },
    });
  }

  confirmDeleteOrder(order: any): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de cancelar la orden #${order.id}? Esta acción no se puede deshacer.`,
      header: 'Cancelar orden',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Cancelar orden',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.deleteOrder(order.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Orden cancelada', detail: `Orden #${order.id} eliminada correctamente` });
            this.loadActiveOrders();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cancelar la orden' });
          },
        });
      },
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

  updateStatus(id: number, status: string): void {
    this.api.updateOrderStatus(id, status).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Estado actualizado', detail: `Orden #${id} marcada como ${status}` });
        this.loadActiveOrders();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado' });
      },
    });
  }

  printTicket(order: any): void {
    const ticketDate = new Date().toLocaleString('es-MX', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });

    const serviceRows = (order.items || [])
      .map((i: any) => `<tr><td>${i.serviceTypeName}</td><td>${i.weight} kg</td><td class="right">\$${i.price.toFixed(2)}</td></tr>`)
      .join('');

    const productRows = (order.products || [])
      .map((p: any) => `<tr><td>${p.productName}</td><td>${p.quantity}</td><td class="right">\$${p.unitPrice.toFixed(2)}</td></tr>`)
      .join('');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    JsBarcode(svg, String(order.id), { format: 'CODE128', width: 2, height: 60, displayValue: true, fontSize: 14, margin: 0 });
    const barcodeSvg = svg.outerHTML;

    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
      <head>
        <title>Ticket #${order.id}</title>
        <style>
          body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 18px; }
          .header p { margin: 2px 0; font-size: 11px; color: #666; }
          .barcode { text-align: center; margin: 15px 0; }
          .barcode svg { max-width: 100%; height: auto; }
          .divider { border-top: 1px dashed #333; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; font-size: 11px; padding: 4px 0; border-bottom: 1px solid #333; }
          td { padding: 4px 0; font-size: 11px; }
          .right { text-align: right; }
          .total { font-size: 16px; font-weight: bold; text-align: right; margin-top: 10px; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #999; }
          .status { text-align: center; margin: 10px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>LAUNDRY POS</h1>
          <p>Ticket #${order.id}</p>
          <p>${ticketDate}</p>
          <p>Cliente: ${order.clientName || 'Mostrador'}</p>
        </div>
        <div class="barcode">${barcodeSvg}</div>
        <div class="divider"></div>
        ${serviceRows ? `
          <h3>Servicios</h3>
          <table>
            <tr><th>Servicio</th><th>Peso</th><th class="right">Precio</th></tr>
            ${serviceRows}
          </table>
          <div class="divider"></div>
        ` : ''}
        ${productRows ? `
          <h3>Productos</h3>
          <table>
            <tr><th>Producto</th><th>Cant.</th><th class="right">Precio</th></tr>
            ${productRows}
          </table>
          <div class="divider"></div>
        ` : ''}
        <div class="total">Total: \$${order.totalAmount.toFixed(2)}</div>
        <div class="status">Estado: ${order.status}</div>
        <div class="footer">
          <p>¡Gracias por su preferencia!</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  }
}
