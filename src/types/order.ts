
import { CartItem } from './cart';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
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
  }>;
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  notes?: string;
  date: string; // Order date
}

export interface OrderStage {
  name: string;
  completed: boolean;
  date?: string;
  status: string;
}
