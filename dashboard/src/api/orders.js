import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchOrders = async () => {
  const { data } = await axios.get(`${API_URL}/api/orders`);
  return data;
};

export const fetchOrderDetails = async (orderId) => {
  const { data } = await axios.get(`${API_URL}/api/orders/${orderId}`);
  return data;
};