
import { supabase } from './supabaseClient';
import { Order } from '@/types/order';

// This file provides functions to interact with the Supabase database for orders
// You'll need to create a 'orders' table in your Supabase dashboard first

// Fetch all orders from Supabase
export const fetchOrdersFromSupabase = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*');
    
  if (error) {
    console.error('Error fetching orders from Supabase:', error);
    return [];
  }
  
  return data || [];
};

// Create a new order in Supabase
export const createOrderInSupabase = async (order: Omit<Order, 'id'>): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating order in Supabase:', error);
    return null;
  }
  
  return data;
};

// Get orders by user ID from Supabase
export const getOrdersByUserIdFromSupabase = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });
    
  if (error) {
    console.error('Error fetching user orders from Supabase:', error);
    return [];
  }
  
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
