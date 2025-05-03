
import { supabase } from './supabaseClient';
import { Order, OrderStatus } from '@/types/order';
import { useToast } from '@/hooks/use-toast';

// Fetch all orders from Supabase
export const fetchOrdersFromSupabase = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('createdAt', { ascending: false });
    
  if (error) {
    console.error('Error fetching orders from Supabase:', error);
    return [];
  }
  
  return data || [];
};

// Create a new order in Supabase
export const createOrderInSupabase = async (order: Omit<Order, 'id'>): Promise<Order | null> => {
  // Log the order being created for debugging
  console.log('Creating order in Supabase:', order);
  
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating order in Supabase:', error);
    return null;
  }
  
  console.log('Order created successfully:', data);
  return data;
};

// Get orders by user ID from Supabase
export const getOrdersByUserIdFromSupabase = async (userId: string): Promise<Order[]> => {
  console.log('Fetching orders for user:', userId);
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });
    
  if (error) {
    console.error('Error fetching user orders from Supabase:', error);
    return [];
  }
  
  console.log(`Found ${data?.length || 0} orders for user ${userId}`);
  return data || [];
};

// Get a single order by ID from Supabase
export const getOrderByIdFromSupabase = async (id: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching order from Supabase:', error);
    return null;
  }
  
  return data;
};

// Update an order in Supabase
export const updateOrderInSupabase = async (id: string, updates: Partial<Order>): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating order in Supabase:', error);
    return null;
  }
  
  return data;
};

// Delete an order from Supabase
export const deleteOrderFromSupabase = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting order from Supabase:', error);
    return false;
  }
  
  return true;
};

// Update order status in Supabase
export const updateOrderStatusInSupabase = async (id: string, status: OrderStatus): Promise<Order | null> => {
  return await updateOrderInSupabase(id, { status });
};

// Get order statistics for admin dashboard
export const getOrderStatsFromSupabase = async () => {
  // Fetch all orders first
  const orders = await fetchOrdersFromSupabase();
  
  // Calculate statistics
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
