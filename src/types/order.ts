
import { CartItem } from './cart';

export type OrderStatus = 'pending' | 'payment_confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
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

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    imageUrl?: string; // Added for OrderTracking
  }>;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string; // Added back
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  shippingAddress: ShippingAddress;
  address: OrderAddress; // Added back
  trackingNumber?: string;
  estimatedDelivery?: string; // Added back
  notes?: string;
  date: string; // Order date
}

export interface OrderStage {
  name: string;
  completed: boolean;
  date?: string;
  status: string;
}
