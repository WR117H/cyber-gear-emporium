
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderStatus } from '@/types/order';

const ORDERS_STORAGE_KEY = 'cyber_gear_orders';

// Helper to get all orders
export const fetchOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  return storedOrders ? JSON.parse(storedOrders) : [];
};

// Helper to save all orders
const saveOrders = (orders: Order[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

// Create a new order
export const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
  const orders = fetchOrders();
  
  const newOrder: Order = {
    ...orderData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  
  saveOrders([...orders, newOrder]);
  return newOrder;
};

// Get an order by ID
export const getOrderById = (id: string): Order | undefined => {
  const orders = fetchOrders();
  return orders.find(order => order.id === id);
};

// Get orders by user ID
export const getOrdersByUserId = (userId: string): Order[] => {
  const orders = fetchOrders();
  return orders.filter(order => order.userId === userId);
};

// Update an order
export const updateOrder = (id: string, orderData: Partial<Order>): Order | null => {
  const orders = fetchOrders();
  const orderIndex = orders.findIndex(order => order.id === id);
  
  if (orderIndex === -1) return null;
  
  const updatedOrder = {
    ...orders[orderIndex],
    ...orderData,
  };
  
  orders[orderIndex] = updatedOrder;
  saveOrders(orders);
  
  return updatedOrder;
};

// Delete an order
export const deleteOrder = (id: string): boolean => {
  const orders = fetchOrders();
  const filteredOrders = orders.filter(order => order.id !== id);
  
  if (filteredOrders.length === orders.length) return false;
  
  saveOrders(filteredOrders);
  return true;
};

// Update order status
export const updateOrderStatus = (id: string, status: OrderStatus): Order | null => {
  return updateOrder(id, { status });
};
