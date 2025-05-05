
import { CartItem } from './cart';

export type OrderStatus = 'pending' | 'payment_confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface OrderAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

// Define both database schema interface and client interface versions
// This matches exactly the Supabase structure
export interface Order {
  id: string;
  user_id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    description: string;
    imageUrl?: string;
  }>;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  payment_method: string;
  payment_status: 'paid' | 'pending' | 'failed';
  shipping_address: ShippingAddress;
  address: OrderAddress;
  tracking_number?: string;
  estimated_delivery?: string;
  notes?: string;
  date: string;
  order_code?: string;
  
  // For backwards compatibility, include client-side properties
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  paymentMethod?: string;
  shippingAddress?: ShippingAddress;
  trackingNumber?: string;
  estimatedDelivery?: string;
  orderCode?: string;
}

// For backwards compatibility, create a mapping function
export function mapDatabaseOrderToClientOrder(dbOrder: Order): Order {
  return {
    ...dbOrder,
    // Add client-side property aliases
    userId: dbOrder.user_id,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
    paymentMethod: dbOrder.payment_method,
    shippingAddress: dbOrder.shipping_address,
    trackingNumber: dbOrder.tracking_number,
    estimatedDelivery: dbOrder.estimated_delivery,
    orderCode: dbOrder.order_code
  };
}

export function mapClientOrderToDatabaseOrder(clientOrder: any): Order {
  return {
    ...clientOrder,
    // Map client properties to database properties
    user_id: clientOrder.userId || clientOrder.user_id,
    created_at: clientOrder.createdAt || clientOrder.created_at || new Date().toISOString(),
    updated_at: clientOrder.updatedAt || clientOrder.updated_at || new Date().toISOString(),
    payment_method: clientOrder.paymentMethod || clientOrder.payment_method,
    shipping_address: clientOrder.shippingAddress || clientOrder.shipping_address,
    tracking_number: clientOrder.trackingNumber || clientOrder.tracking_number,
    estimated_delivery: clientOrder.estimatedDelivery || clientOrder.estimated_delivery,
    order_code: clientOrder.orderCode || clientOrder.order_code
  };
}

export interface OrderStage {
  name: string;
  completed: boolean;
  date?: string;
  status: string;
}
