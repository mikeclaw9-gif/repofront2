export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  username: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
  active: boolean;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  createdAt: string;
}

export interface ServiceOrder {
  id: number;
  clientId: number | null;
  clientName: string | null;
  userId: number;
  userName: string;
  totalWeight: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  readyAt: string | null;
  items: OrderItem[];
  products: OrderProduct[];
}

export interface OrderItem {
  id: number;
  serviceTypeName: string;
  weight: number;
  price: number;
}

export interface OrderProduct {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  supplierId: number | null;
  supplierName: string | null;
  lowStock: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
}

export interface ServiceType {
  id: number;
  name: string;
  pricePerKg: number;
  estimatedTimeMinutes: number;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
  expenseDate: string;
  notes: string;
  createdAt: string;
}

export interface CashClosure {
  id: number;
  initialCash: number;
  totalSales: number;
  totalExpenses: number;
  expectedCash: number;
  declaredCash: number | null;
  difference: number | null;
  status: string;
  openedBy: string;
  closedBy: string | null;
  openedAt: string;
  closedAt: string | null;
  createdAt: string;
}
