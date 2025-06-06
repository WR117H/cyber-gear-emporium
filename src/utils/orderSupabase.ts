
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus, OrderDB, mapDatabaseOrderToClientOrder, mapClientOrderToDatabaseOrder } from '@/types/order';
import { Json } from '@/integrations/supabase/types';

// Fetch all orders from Supabase
export const fetchOrdersFromSupabase = async (): Promise<Order[]> => {
  console.log('Fetching all orders from Supabase');
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching orders from Supabase:', error);
    return [];
  }
  
  console.log(`Successfully fetched ${data?.length || 0} orders from Supabase`);
  // Map database format to client format
  return (data || []).map(order => mapDatabaseOrderToClientOrder(order as OrderDB));
};

// Create a new order in Supabase
export const createOrderInSupabase = async (order: Partial<Order>): Promise<Order | null> => {
  // Log the order being created for debugging
  console.log('Creating order in Supabase:', order);
  
  // Convert client order format to database format
  const dbOrder = mapClientOrderToDatabaseOrder({
    ...order,
    id: order.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    created_at: order.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: order.status || 'pending',
  });
  
  // Ensure required fields are present
  if (!dbOrder.id || !dbOrder.items || !dbOrder.status || typeof dbOrder.total !== 'number') {
    console.error('Missing required fields for order creation:', dbOrder);
    return null;
  }
  
  const { data, error } = await supabase
    .from('orders')
    .insert([dbOrder as any])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating order in Supabase:', error);
    return null;
  }
  
  console.log('Order created successfully in Supabase:', data);
  return mapDatabaseOrderToClientOrder(data as OrderDB);
};

// Get orders by user ID from Supabase
export const getOrdersByUserIdFromSupabase = async (userId: string): Promise<Order[]> => {
  console.log('Fetching orders for user:', userId);
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching user orders from Supabase:', error);
    return [];
  }
  
  console.log(`Found ${data?.length || 0} orders for user ${userId}`);
  return (data || []).map(order => mapDatabaseOrderToClientOrder(order as OrderDB));
};

// Get a single order by ID from Supabase
export const getOrderByIdFromSupabase = async (id: string): Promise<Order | null> => {
  console.log(`Fetching order with ID ${id} from Supabase`);
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching order from Supabase:', error);
    return null;
  }
  
  console.log('Order found:', data);
  return data ? mapDatabaseOrderToClientOrder(data as OrderDB) : null;
};

// Update an order in Supabase
export const updateOrderInSupabase = async (id: string, updates: Partial<Order>): Promise<Order | null> => {
  console.log(`Updating order ${id} in Supabase with:`, updates);
  
  // Add extra logging for status updates
  if (updates.status) {
    console.log(`Explicitly setting status to: ${updates.status}`);
  }
  
  // Convert client order format to database format
  const dbUpdates = mapClientOrderToDatabaseOrder({
    ...updates,
    updated_at: new Date().toISOString(),
  });
  
  console.log("Converted updates for database:", dbUpdates);
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .update(dbUpdates as any)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating order in Supabase:', error);
      return null;
    }
    
    if (updates.status && data.status !== updates.status) {
      console.warn(`Warning: Status mismatch in Supabase update. Expected ${updates.status} but got ${data.status}`);
      
      // Try a direct update specifically for the status
      const statusUpdateResult = await supabase
        .from('orders')
        .update({ status: updates.status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
        
      if (statusUpdateResult.error) {
        console.error('Error in follow-up status update:', statusUpdateResult.error);
      } else {
        console.log('Status updated in follow-up query:', statusUpdateResult.data);
        return mapDatabaseOrderToClientOrder(statusUpdateResult.data as OrderDB);
      }
    }
    
    console.log('Order updated successfully:', data);
    return data ? mapDatabaseOrderToClientOrder(data as OrderDB) : null;
  } catch (error) {
    console.error('Exception during order update in Supabase:', error);
    return null;
  }
};

// Delete an order from Supabase
export const deleteOrderFromSupabase = async (id: string): Promise<boolean> => {
  console.log(`Deleting order ${id} from Supabase`);
  
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting order from Supabase:', error);
    return false;
  }
  
  console.log('Order deleted successfully');
  return true;
};

// Update order status in Supabase
export const updateOrderStatusInSupabase = async (id: string, status: OrderStatus): Promise<Order | null> => {
  console.log(`Updating order ${id} status to ${status} in Supabase`);
  return await updateOrderInSupabase(id, { status });
};

// Get order statistics for admin dashboard
export const getOrderStatsFromSupabase = async () => {
  console.log('Calculating order stats from Supabase');
  
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
  
  console.log('Order stats calculated:', { totalRevenue, totalOrders, ordersByStatus });
  
  return {
    totalRevenue,
    totalOrders,
    ordersByStatus
  };
};
