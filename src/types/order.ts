
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

// Adapted to match the Supabase database schema
export interface Order {
  id: string;
  user_id: string;   // Changed from userId to match Supabase
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
  created_at: string; // Changed from createdAt to match Supabase
  updated_at: string; // Changed from updatedAt to match Supabase
  payment_method: string; // Changed from paymentMethod to match Supabase
  payment_status: 'paid' | 'pending' | 'failed';
  shipping_address: ShippingAddress; // Changed from shippingAddress to match Supabase
  address: OrderAddress;
  tracking_number?: string; // Changed from trackingNumber to match Supabase
  estimated_delivery?: string; // Changed from estimatedDelivery to match Supabase
  notes?: string;
  date: string;
  order_code?: string; // Changed from orderCode to match Supabase
}

// For backwards compatibility, create a mapping function
export function mapDatabaseOrderToClientOrder(dbOrder: Order): any {
  return {
    ...dbOrder,
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
    user_id: clientOrder.userId,
    created_at: clientOrder.createdAt,
    updated_at: clientOrder.updatedAt,
    payment_method: clientOrder.paymentMethod,
    shipping_address: clientOrder.shippingAddress,
    tracking_number: clientOrder.trackingNumber,
    estimated_delivery: clientOrder.estimatedDelivery,
    order_code: clientOrder.orderCode
  };
}

export interface OrderStage {
  name: string;
  completed: boolean;
  date?: string;
  status: string;
}
