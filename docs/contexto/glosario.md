# Glosario

## Términos del dominio

| Término       | Significado                                                |
|---------------|------------------------------------------------------------|
| Orden / Order | Servicio de lavandería + productos asociados a un cliente  |
| Corte de Caja | Apertura/cierre de turno con conteo de efectivo            |
| Servicio      | Tipo de lavado con precio por kg y tiempo estimado         |
| Producto      | Artículo de inventario (ej: jabón, bolsas)                 |
| Proveedor     | Empresa que suministra productos                           |
| Gasto         | Egreso operativo (alquiler, nómina, insumos, etc.)         |

## Entidades principales (definidas en `auth.models.ts`)

| Interfaz        | Campos clave                                                      |
|-----------------|-------------------------------------------------------------------|
| LoginResponse   | token, refreshToken, username, role                               |
| User            | id, username, role, active                                        |
| Client          | id, name, phone, email, loyaltyPoints                             |
| ServiceOrder    | id, clientId, userId, totalWeight, totalAmount, status, items, products |
| OrderItem       | id, serviceTypeName, weight, price                                |
| OrderProduct    | id, productName, quantity, unitPrice, subtotal                    |
| Product         | id, name, category, price, stock, minStock, lowStock              |
| Supplier        | id, name, contactName, phone, email, address                      |
| ServiceType     | id, name, pricePerKg, estimatedTimeMinutes                        |
| Expense         | id, description, amount, category, paymentMethod, expenseDate     |
| CashClosure     | id, initialCash, totalSales, totalExpenses, expectedCash, declaredCash, status |

## Estados de Orden

| Estado      | Significado                          |
|-------------|--------------------------------------|
| PENDIENTE   | Recién creada, sin procesar          |
| EN_PROCESO  | En lavandería                        |
| LISTO       | Terminada, lista para entregar       |
| ENTREGADO   | Entregada al cliente                 |

## Siglas internas

| Sigla  | Significado            |
|--------|------------------------|
| POS    | Point of Sale          |
| API    | Application Programming Interface |
| JWT    | JSON Web Token         |
