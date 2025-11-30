import React from 'react';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useRideOrders, useDeleteRideOrder } from '@/features/rideorders/api';

export const Route = createFileRoute('/rideorders/list')({
  component: RideOrdersListPage,
});

function RideOrdersListPage() {
  const navigate = useNavigate();
  const { data: rideOrders, isLoading, isError, error } = useRideOrders();
  const deleteMutation = useDeleteRideOrder();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this ride order?')) {
      deleteMutation.mutate(String(id));
      navigate({ to: '/rideorders/list' });
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError) return <div className="p-4">Error loading ride orders: {(error as any)?.message ?? String(error)}</div>;

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
          <Link to="/rideorders/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create New Ride Order
          </Link>
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Payment</th>
            <th className="py-2 px-4 border-b">Client</th>
            <th className="py-2 px-4 border-b">Driver</th>
            <th className="py-2 px-4 border-b">Start</th>
            <th className="py-2 px-4 border-b">End</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rideOrders?.map((ro) => (
            <tr key={ro.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{ro.id}</td>
              <td className="py-2 px-4 border-b">{ro.order_status}</td>
              <td className="py-2 px-4 border-b">{ro.payment_type}</td>
              <td className="py-2 px-4 border-b">
                <Link to={`/users/${ro.client?.id}`} className="text-blue-500 hover:underline">
                  {ro.client?.name ?? 'No Client'}
                </Link>
              </td>
              <td className="py-2 px-4 border-b">
                {
                  ro.driver ? (
                    <Link to={`/users/${ro.driver.id}`} className="text-blue-500 hover:underline">
                      {ro.driver.name}
                    </Link>
                  ) : 'No Driver'
                }

              </td>
              <td className="py-2 px-4 border-b">{ro.start_date}</td>
              <td className="py-2 px-4 border-b">{ro.end_date ?? '—'}</td>
              <td className="py-2 px-4 border-b">
                <Link
                  to={`/rideorders/update/${ro.id}`}
                  className="cursor-pointer text-yellow-500 px-2 py-1"
                >
                  Edit
                </Link>
                <Link
                  onClick={() => handleDelete(Number(ro.id))}
                  className="cursor-pointer text-red-500 px-2 py-1"
                >
                  Delete
                </Link>
                <Link
                  to={`/rideorders/${ro.id}`}
                  className="cursor-pointer text-blue-500 px-2 py-1"
                >
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}