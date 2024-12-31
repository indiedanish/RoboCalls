import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '../api/orders';

export default function Dashboard() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders-summary'],
    queryFn: fetchOrders
  });

  if (isLoading) return <div>Loading...</div>;

  const totalOrders = orders?.length || 0;
  const confirmedOrders = orders?.filter(order => order.callStatus.confirmedByCall).length || 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">{totalOrders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Confirmed Orders</h3>
          <p className="text-3xl font-bold mt-2">{confirmedOrders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Confirmation Rate</h3>
          <p className="text-3xl font-bold mt-2">
            {totalOrders ? Math.round((confirmedOrders / totalOrders) * 100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}