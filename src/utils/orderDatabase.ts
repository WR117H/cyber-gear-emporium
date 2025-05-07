
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderStatus, OrderDB, mapDatabaseOrderToClientOrder, mapClientOrderToDatabaseOrder } from '@/types/order';
import { isSupabaseConfigured } from './supabaseClient';
import { 
  createOrderInSupabase, 
  fetchOrdersFromSupabase,
  getOrderByIdFromSupabase,
  getOrdersByUserIdFromSupabase,
  updateOrderInSupabase,
  deleteOrderFromSupabase,
  getOrderStatsFromSupabase
} from './orderSupabase';

const ORDERS_STORAGE_KEY = 'cyber_gear_orders';

// Helper to get all orders - now tries Supabase first, falls back to localStorage
export const fetchOrders = async (): Promise<Order[]> => {
  console.log('fetchOrders called - checking data source');
  
  // Try to fetch from Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      console.log('Fetching orders from Supabase...');
      const orders = await fetchOrdersFromSupabase();
      console.log(`Fetched ${orders.length} orders from Supabase`);
      return orders;
    } catch (error) {
      console.error('Error fetching from Supabase, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
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
export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
  const now = new Date().toISOString();
  
  // Generate a simplified order ID for better usability
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Generate an order code for confirmation page
  const orderCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const newOrder: Partial<Order> = {
    ...orderData,
    id: orderId,
    createdAt: now,
    created_at: now,
    updatedAt: now,
    updated_at: now,
    status: 'pending' as OrderStatus,
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
  
  // Try to save to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      console.log('Creating order in Supabase:', newOrder);
      const supabaseOrder = await createOrderInSupabase(newOrder);
      if (supabaseOrder) {
        console.log('Order created in Supabase:', supabaseOrder);
        return supabaseOrder;
      }
    } catch (error) {
      console.error('Error creating order in Supabase, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  const orders = await fetchOrders();
  const clientOrder = newOrder as Order;
  orders.push(clientOrder);
  saveOrders(orders);
  
  // Debug log for tracking
  console.log("Created new order:", clientOrder);
  
  return clientOrder;
};

// Get an order by ID
export const getOrderById = async (id: string): Promise<Order | undefined> => {
  console.log(`getOrderById called for id: ${id}`);
  
  // Try to fetch from Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      console.log(`Fetching order ${id} from Supabase`);
      const order = await getOrderByIdFromSupabase(id);
      if (order) {
        console.log('Order found in Supabase:', order);
        return order;
      }
    } catch (error) {
      console.error('Error fetching from Supabase, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  const orders = await fetchOrders();
  const order = orders.find(order => order.id === id);
  console.log(`Order ${id} found in localStorage:`, order);
  return order;
};

// Get orders by user ID
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  console.log(`getOrdersByUserId called for userId: ${userId}`);
  
  // Try to fetch from Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      console.log(`Fetching orders for user ${userId} from Supabase`);
      const orders = await getOrdersByUserIdFromSupabase(userId);
      console.log(`Found ${orders.length} orders in Supabase for user ${userId}`);
      return orders;
    } catch (error) {
      console.error('Error fetching from Supabase, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  const orders = await fetchOrders();
  console.log(`Looking for orders with userId: ${userId}`);
  console.log('All orders available:', orders);
  
  const userOrders = orders.filter(order => order.userId === userId || order.user_id === userId);
  console.log(`Found ${userOrders.length} orders for user ${userId} in localStorage`);
  return userOrders;
};

// Update an order
export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<Order | null> => {
  console.log(`updateOrder called for id: ${id}`, orderData);
  
  // Try to update in Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      console.log(`Updating order ${id} in Supabase`);
      const updatedOrder = await updateOrderInSupabase(id, {
        ...orderData,
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      if (updatedOrder) {
        console.log('Order updated in Supabase:', updatedOrder);
        return updatedOrder;
      }
    } catch (error) {
      console.error('Error updating in Supabase, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  let orders = await fetchOrders();
  const orderIndex = orders.findIndex(order => order.id === id);
  
  if (orderIndex === -1) {
    console.error(`Order ${id} not found in localStorage`);
    return null;
  }
  
  // Make sure we preserve both status formats for compatibility and update timestamps
  const updatedOrder: Order = {
    ...orders[orderIndex],
    ...orderData,
    updatedAt: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Special case handling for status
  if (orderData.status) {
    console.log(`Explicitly setting status to ${orderData.status}`);
    updatedOrder.status = orderData.status; // Ensure status is properly set
  }
  
  console.log(`Updated order data for ${id}:`, updatedOrder);
  
  // Replace the order in the array
  orders[orderIndex] = updatedOrder;
  
  // Make sure to save the updated orders array
  saveOrders(orders);
  
  console.log(`Order ${id} updated successfully in localStorage:`, updatedOrder);
  return updatedOrder;
};

// Delete an order
export const deleteOrder = async (id: string): Promise<boolean> => {
  console.log(`deleteOrder called for id: ${id}`);
  
  // Try to delete from Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      console.log(`Deleting order ${id} from Supabase`);
      const success = await deleteOrderFromSupabase(id);
      if (success) {
        console.log(`Order ${id} successfully deleted from Supabase`);
        return true;
      }
    } catch (error) {
      console.error('Error deleting from Supabase, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  const orders = await fetchOrders();
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

// Update order status with improved error handling and consistency
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order | null> => {
  console.log(`updateOrderStatus called for id: ${id}, status: ${status}`);
  
  try {
    // Ensure we're correctly passing the status property
    const result = await updateOrder(id, { 
      status: status,
      // Make sure we update both standard and Supabase-compatible formats
      // This ensures the status is picked up regardless of what the UI is looking at
      status: status
    });
    
    if (result) {
      console.log(`Order ${id} status successfully updated to ${status}:`, result);
      // Double check that status actually changed
      if (result.status !== status) {
        console.warn(`Warning: Status mismatch after update. Expected ${status} but got ${result.status}`);
      }
      return result;
    } else {
      console.error(`Failed to update order ${id} status to ${status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error updating status for order ${id}:`, error);
    return null;
  }
};

// Update order tracking info
export const updateOrderTracking = async (
  id: string, 
  trackingNumber: string, 
  estimatedDelivery?: string
): Promise<Order | null> => {
  console.log(`updateOrderTracking called for id: ${id}, tracking: ${trackingNumber}`);
  return updateOrder(id, { 
    trackingNumber, 
    tracking_number: trackingNumber,
    estimatedDelivery, 
    estimated_delivery: estimatedDelivery 
  });
};

// Function to get statistics for admin dashboard
export const getOrderStats = async () => {
  console.log('getOrderStats called');
  
  if (isSupabaseConfigured()) {
    try {
      console.log('Getting order stats from Supabase');
      return await getOrderStatsFromSupabase();
    } catch (error) {
      console.error('Error getting stats from Supabase, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage calculation
  const orders = await fetchOrders();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  
  // Count by status
  const ordersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log("Order stats calculated from localStorage:", { totalRevenue, totalOrders, ordersByStatus });
  
  return {
    totalRevenue,
    totalOrders,
    ordersByStatus
  };
};

// Function to debug all orders in database
export const debugAllOrders = async () => {
  const orders = await fetchOrders();
  console.log("All orders in database:", orders);
  return orders;
};
