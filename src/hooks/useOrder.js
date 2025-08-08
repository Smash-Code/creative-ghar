import { useState } from 'react';

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]); // Initialize as empty array
  const [order , setOrder] = useState(null)

  const getAllOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/order');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }
      
      // Ensure we always set an array, even if data.data is undefined
      setOrders(Array.isArray(data?.data) ? data.data : []);
      return data.data || [];
    } catch (err) {
      setError(err.message);
      setOrders([]); // Reset to empty array on error
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const updateOrder = async (orderId, updateData) => {
  try {
    const response = await fetch(`/api/order/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update order');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    setOrder(orderData)
    
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateOrder,createOrder, getAllOrders, orders, order,loading, error };
};