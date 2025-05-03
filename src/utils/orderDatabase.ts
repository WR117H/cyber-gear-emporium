
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
export const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'updatedAt'>): Order => {
  const orders = fetchOrders();
  const now = new Date().toISOString();
  
  // Generate a simplified order ID for better usability
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const newOrder: Order = {
    ...orderData,
    id: orderId,
    createdAt: now,
    updatedAt: now,
    status: 'pending'
  };
  
  // Add images to the items if missing
  if (newOrder.items) {
    newOrder.items = newOrder.items.map(item => {
      if (!item.imageUrl && item.image) {
        return {
          ...item,
          imageUrl: item.image
        };
      }
      return item;
    });
  }
  
  orders.push(newOrder);
  saveOrders(orders);
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
    updatedAt: new Date().toISOString()
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

// Update order tracking info
export const updateOrderTracking = (
  id: string, 
  trackingNumber: string, 
  estimatedDelivery?: string
): Order | null => {
  return updateOrder(id, { trackingNumber, estimatedDelivery });
};

// Function to get statistics for admin dashboard
export const getOrderStats = () => {
  const orders = fetchOrders();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  
  // Count by status
  const ordersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalRevenue,
    totalOrders,
    ordersByStatus
  };
};
