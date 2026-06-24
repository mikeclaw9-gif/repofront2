import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ServiceOrder } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly http = inject(HttpClient);

  getSalesByDateRange(startDate: string, endDate: string): Observable<ServiceOrder[]> {
    return this.http.get<ServiceOrder[]>('/api/sales/orders').pipe(
      map(orders => orders.filter(order => {
        const date = order.createdAt.split('T')[0];
        return date >= startDate && date <= endDate;
      }))
    );
  }

  getSalesToday(): Observable<ServiceOrder[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getSalesByDateRange(today, today);
  }
}