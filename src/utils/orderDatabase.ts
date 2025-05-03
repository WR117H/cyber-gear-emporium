
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderStatus } from '@/types/order';

const ORDERS_STORAGE_KEY = 'cyber_gear_orders';

// Helper to get all orders
export const fetchOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  
  // Add debug log to check what's in localStorage
  console.log('Raw orders from localStorage:', storedOrders);
  
  return storedOrders ? JSON.parse(storedOrders) : [];
};

// Helper to save all orders
const saveOrders = (orders: Order[]): void => {
  if (typeof window === 'undefined') return;
  
  // Add debug log before saving to localStorage
  console.log('Saving orders to localStorage:', orders);
  
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

// Create a new order
export const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'updatedAt'>): Order => {
  const orders = fetchOrders();
  const now = new Date().toISOString();
  
  // Generate a simplified order ID for better usability
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Generate an order code for confirmation page
  const orderCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const newOrder: Order = {
    ...orderData,
    id: orderId,
    createdAt: now,
    updatedAt: now,
    status: 'pending',
    orderCode: orderCode
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
  
  // Make sure we have the address fields properly saved
  if (newOrder.address && !newOrder.shippingAddress) {
    newOrder.shippingAddress = {
      fullName: newOrder.address.fullName,
      street: newOrder.address.streetAddress,
      city: newOrder.address.city,
      state: newOrder.address.state,
      zipCode: newOrder.address.postalCode,
      country: newOrder.address.country,
      phone: newOrder.address.phone
    };
  }
  
  // Save immediately to localStorage
  orders.push(newOrder);
  saveOrders(orders);
  
  // Debug log for tracking
  console.log("Created new order:", newOrder);
  
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
  console.log(`Looking for orders with userId: ${userId}`);
  console.log('All orders available:', orders);
  
  const userOrders = orders.filter(order => order.userId === userId);
  console.log(`Found ${userOrders.length} orders for user ${userId}`);
  return userOrders;
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

// Clear all orders (for testing)
export const clearAllOrders = (): void => {
  saveOrders([]);
  console.log("All orders cleared from localStorage");
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
  
  console.log("Order stats:", { totalRevenue, totalOrders, ordersByStatus });
  
  return {
    totalRevenue,
    totalOrders,
    ordersByStatus
  };
};

// Function to debug all orders in database
export const debugAllOrders = () => {
  const orders = fetchOrders();
  console.log("All orders in database:", orders);
  return orders;
};
