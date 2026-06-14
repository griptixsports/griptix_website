export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_production"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderCurrency = "USD" | "INR";

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  customizations: Record<string, string>;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  currency: OrderCurrency;
  shipping_address: Record<string, string>;
  notes: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItemCreate {
  product_id: string;
  quantity: number;
  customizations?: Record<string, string>;
}

export interface OrderCreate {
  items: OrderItemCreate[];
  shipping_address: Record<string, string>;
  currency?: OrderCurrency;
  notes?: string;
}
