import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CashClosure, Client, Expense, Product, ServiceOrder, ServiceType, Supplier, User } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  createUser(data: any): Observable<User> {
    return this.http.post<User>('/api/users', data);
  }

  updateUser(id: number, data: any): Observable<User> {
    return this.http.put<User>(`/api/users/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }

  toggleUserStatus(id: number): Observable<void> {
    return this.http.patch<void>(`/api/users/${id}/status`, {});
  }

  // Clients
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>('/api/clients');
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`/api/clients/${id}`);
  }

  createClient(data: any): Observable<Client> {
    return this.http.post<Client>('/api/clients', data);
  }

  updateClient(id: number, data: any): Observable<Client> {
    return this.http.put<Client>(`/api/clients/${id}`, data);
  }

  searchClients(phone: string): Observable<Client[]> {
    return this.http.get<Client[]>(`/api/clients/search?phone=${phone}`);
  }

  // Sales
  createServiceOrder(data: any): Observable<ServiceOrder> {
    return this.http.post<ServiceOrder>('/api/sales/service-order', data);
  }

  getOrders(): Observable<ServiceOrder[]> {
    return this.http.get<ServiceOrder[]>('/api/sales/orders');
  }

  getOrder(id: number): Observable<ServiceOrder> {
    return this.http.get<ServiceOrder>(`/api/sales/orders/${id}`);
  }

  updateOrderStatus(id: number, status: string): Observable<ServiceOrder> {
    return this.http.put<ServiceOrder>(`/api/sales/orders/${id}/status`, { status });
  }

  getActiveOrders(): Observable<ServiceOrder[]> {
    return this.http.get<ServiceOrder[]>('/api/sales/active-orders');
  }

  // Inventory
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/inventory/products');
  }

  createProduct(data: any): Observable<Product> {
    return this.http.post<Product>('/api/inventory/products', data);
  }

  updateProduct(id: number, data: any): Observable<Product> {
    return this.http.put<Product>(`/api/inventory/products/${id}`, data);
  }

  getLowStockAlerts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/inventory/low-stock-alerts');
  }

  // Service Types (Sales)
  getServiceTypes(): Observable<ServiceType[]> {
    return this.http.get<ServiceType[]>('/api/sales/service-types');
  }

  getServiceType(id: number): Observable<ServiceType> {
    return this.http.get<ServiceType>(`/api/sales/service-types/${id}`);
  }

  createServiceType(data: any): Observable<ServiceType> {
    return this.http.post<ServiceType>('/api/sales/service-types', data);
  }

  updateServiceType(id: number, data: any): Observable<ServiceType> {
    return this.http.put<ServiceType>(`/api/sales/service-types/${id}`, data);
  }

  deleteServiceType(id: number): Observable<void> {
    return this.http.delete<void>(`/api/sales/service-types/${id}`);
  }

  // Suppliers
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>('/api/suppliers');
  }

  createSupplier(data: any): Observable<Supplier> {
    return this.http.post<Supplier>('/api/suppliers', data);
  }

  updateSupplier(id: number, data: any): Observable<Supplier> {
    return this.http.put<Supplier>(`/api/suppliers/${id}`, data);
  }

  // Reports
  getDailySales(date: string): Observable<any> {
    return this.http.get(`/api/reports/sales/daily?date=${date}`);
  }

  getWeeklySales(start: string, end: string): Observable<any> {
    return this.http.get(`/api/reports/sales/weekly?start=${start}&end=${end}`);
  }

  getMonthlySales(month: number, year: number): Observable<any> {
    return this.http.get(`/api/reports/sales/monthly?month=${month}&year=${year}`);
  }

  getYearlySales(year: number): Observable<any> {
    return this.http.get(`/api/reports/sales/yearly?year=${year}`);
  }

  getTopProducts(): Observable<any[]> {
    return this.http.get<any[]>('/api/reports/top-products');
  }

  getTopClients(): Observable<any[]> {
    return this.http.get<any[]>('/api/reports/top-clients');
  }

  // Orders
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`/api/sales/orders/${id}`);
  }

  // Expenses
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>('/api/expenses');
  }

  getExpense(id: number): Observable<Expense> {
    return this.http.get<Expense>(`/api/expenses/${id}`);
  }

  searchExpenses(query: string): Observable<Expense[]> {
    return this.http.get<Expense[]>(`/api/expenses/search?q=${query}`);
  }

  getExpensesByDateRange(start: string, end: string): Observable<Expense[]> {
    return this.http.get<Expense[]>(`/api/expenses/date-range?start=${start}&end=${end}`);
  }

  getExpensesByCategory(category: string): Observable<Expense[]> {
    return this.http.get<Expense[]>(`/api/expenses/category/${category}`);
  }

  createExpense(data: any): Observable<Expense> {
    return this.http.post<Expense>('/api/expenses', data);
  }

  updateExpense(id: number, data: any): Observable<Expense> {
    return this.http.put<Expense>(`/api/expenses/${id}`, data);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`/api/expenses/${id}`);
  }

  // Cash Closure
  getCashClosures(): Observable<CashClosure[]> {
    return this.http.get<CashClosure[]>('/api/cash-closure');
  }

  getCashClosure(id: number): Observable<CashClosure> {
    return this.http.get<CashClosure>(`/api/cash-closure/${id}`);
  }

  getCashClosureSummary(start: string, end: string): Observable<any> {
    return this.http.get(`/api/cash-closure/summary?start=${start}&end=${end}`);
  }

  openCashClosure(data: any): Observable<CashClosure> {
    return this.http.post<CashClosure>('/api/cash-closure', data);
  }

  closeCashClosure(id: number, data: any): Observable<CashClosure> {
    return this.http.post<CashClosure>(`/api/cash-closure/${id}/close`, data);
  }

  // Health
  checkHealth(): Observable<any> {
    return this.http.get('/api/health');
  }
}
