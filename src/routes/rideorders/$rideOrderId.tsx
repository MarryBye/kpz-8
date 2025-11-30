// ...existing code...
import React from 'react';
import { Link, createFileRoute, useParams, useNavigate } from '@tanstack/react-router';
import { useRideOrder, useDeleteRideOrder } from '@/features/rideorders/api';

export const Route = createFileRoute('/rideorders/$rideOrderId')({
  component: RideOrderDetailPage,
});

function RideOrderDetailPage() {
  const navigate = useNavigate();
  const { rideOrderId } = useParams({ from: '/rideorders/$rideOrderId' });
  const { data: order, isLoading, isError, error } = useRideOrder(rideOrderId);
  const deleteRideOrder = useDeleteRideOrder(rideOrderId);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ride order?')) {
      deleteRideOrder.mutate(id);
      navigate({ to: '/rideorders/list' });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading ride order: {(error as any)?.message ?? String(error)}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex row gap-2 items-center">
          <h1 className="text-2xl font-bold">TaxiCRM</h1>
          <Link to="/users/list" className="text-blue-500 hover:underline">Users</Link>
          <Link to="/cars/list" className="text-blue-500 hover:underline">Cars</Link>
          <Link to="/rideorders/list" className="text-blue-500 hover:underline">Orders</Link>
        </div>
        <div className="buttons-group">
          <Link to="/rideorders/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create New Ride Order</Link>
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Ride Order Info</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">
              <p><strong>ID:</strong> {order?.id}</p>
              <p><strong>Status:</strong> {order?.order_status}</p>
              <p><strong>Payment:</strong> {order?.payment_type}</p>
              <p>
                <strong>Client:</strong>
                {
                  order?.client?.name
                    ?
                  <Link to={`/users/${order?.client?.id}`} className="text-blue-500 hover:underline">
                    {order?.client?.name ?? 'No client'}
                  </Link>
                    :
                  ' No client'
                }
                
              </p>
              <p>
                <strong>Driver:</strong>{' '}
                {
                  order?.driver?.name
                    ?
                  <Link to={`/users/${order?.driver?.id}`} className="text-blue-500 hover:underline">
                    {order?.driver?.name ?? 'No driver'}
                  </Link>
                    :
                  ' No driver'
                }
              </p>
              <p><strong>Start:</strong> {order?.start_date}</p>
              <p><strong>End:</strong> {order?.end_date ?? '—'}</p>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/rideorders/update/${order?.id}`}
                  className="cursor-pointer text-white font-bold w-full py-2 text-center bg-yellow-500 rounded"
                >
                  Update
                </Link>
                <Link
                  onClick={() => handleDelete(String(order?.id))}
                  className="cursor-pointer text-white font-bold w-full py-2 text-center bg-red-500 rounded"
                >
                  Delete
                </Link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
// ...existing