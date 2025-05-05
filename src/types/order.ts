
import { CartItem } from './cart';
import { Json } from '@/integrations/supabase/types';

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
// Database interface (matches Supabase structure)
export interface OrderDB {
  id: string;
  user_id: string;
  items: Json;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
  payment_method: string | null;
  payment_status: string | null;
  shipping_address: Json | null;
  address: Json | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  notes: string | null;
  date: string | null;
  order_code: string | null;
}

// Client interface (used in the frontend)
export interface Order {
  id: string;
  user_id: string;
  userId?: string;
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
  createdAt?: string;
  updated_at: string;
  updatedAt?: string;
  payment_method: string;
  paymentMethod?: string;
  payment_status: 'paid' | 'pending' | 'failed';
  shipping_address: ShippingAddress;
  shippingAddress?: ShippingAddress;
  address: OrderAddress;
  tracking_number?: string;
  trackingNumber?: string;
  estimated_delivery?: string;
  estimatedDelivery?: string;
  notes?: string;
  date: string;
  order_code?: string;
  orderCode?: string;
}

// Map database order to client order
export function mapDatabaseOrderToClientOrder(dbOrder: OrderDB): Order {
  // Parse JSON fields
  const items = Array.isArray(dbOrder.items) 
    ? dbOrder.items 
    : typeof dbOrder.items === 'string' 
      ? JSON.parse(dbOrder.items as string)
      : dbOrder.items;
      
  const shippingAddress = dbOrder.shipping_address 
    ? (typeof dbOrder.shipping_address === 'string' 
        ? JSON.parse(dbOrder.shipping_address as string) 
        : dbOrder.shipping_address)
    : undefined;
    
  const address = dbOrder.address 
    ? (typeof dbOrder.address === 'string' 
        ? JSON.parse(dbOrder.address as string) 
        : dbOrder.address) 
    : undefined;
    
  return {
    ...dbOrder,
    items: items as any[],
    status: dbOrder.status as OrderStatus,
    shipping_address: shippingAddress as ShippingAddress,
    address: address as OrderAddress,
    // Add client-side property aliases
    userId: dbOrder.user_id,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
    paymentMethod: dbOrder.payment_method || '',
    shippingAddress: shippingAddress as ShippingAddress,
    trackingNumber: dbOrder.tracking_number,
    estimatedDelivery: dbOrder.estimated_delivery,
    orderCode: dbOrder.order_code
  };
}

// Map client order to database order
export function mapClientOrderToDatabaseOrder(clientOrder: Partial<Order>): OrderDB {
  const result: Partial<OrderDB> = {
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
  
  return result as OrderDB;
}

export interface OrderStage {
  name: string;
  completed: boolean;
  date?: string;
  status: string;
}
