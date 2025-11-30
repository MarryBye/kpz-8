import React, { useEffect } from 'react';
import { createFileRoute, Link, useNavigate, useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useRideOrder, useUpdateRideOrder } from '@/features/rideorders/api';

export const Route = createFileRoute('/rideorders/update/$rideOrderId')({
  component: RouteComponent,
});

type FormData = {
  order_status?: string;
  payment_type?: string;
  start_date?: string;
  end_date?: string;
  driverId?: number | '';
  clientId?: number | '';
};

function RouteComponent() {
  const navigate = useNavigate();
  const { rideOrderId } = useParams({ from: '/rideorders/update/$rideOrderId' });
  const { data: order, isLoading, isError, error } = useRideOrder(rideOrderId);
  const update = useUpdateRideOrder();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: { order_status: '', payment_type: '', start_date: '', end_date: '', driverId: '', clientId: '' },
  });

  useEffect(() => {
    if (order) {
      reset({
        order_status: order.order_status ?? '',
        payment_type: order.payment_type ?? '',
        start_date: order.start_date ?? '',
        end_date: order.end_date ?? '',
        driverId: order.driver ? order.driver.id : '',
        clientId: order.client ? order.client.id : '',
      });
    }
  }, [order, reset]);

  const onSubmit = (data: FormData) => {
    const payload: any = {
      order_status: data.order_status,
      payment_type: data.payment_type,
      clientId: data.clientId,
      start_date: data.start_date ? data.start_date : undefined,
      end_date: data.end_date ? data.end_date : undefined,
      driverId: data.driverId ? data.driverId : undefined,
    };

    update.mutate(
      { id: rideOrderId, data: payload },
      { onSuccess: () => navigate({ to: `/rideorders/${rideOrderId}` }) }
    );
  };

  if (!rideOrderId || isNaN(Number(rideOrderId))) return <div className="p-4">Missing or invalid ride order id.</div>;
  if (isLoading) return <div className="p-4">Loading ride order...</div>;
  if (isError) return <div className="p-4 text-red-600">Error: {(error as any)?.message ?? String(error)}</div>;
  if (!order) return <div className="p-4">Ride order not found.</div>;

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <Link to={`/rideorders/list`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">&larr; Back to ride orders</Link>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Edit Ride Order #{order.id}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Status</label>
          <input {...register('order_status')} className="w-full border px-2 py-1 rounded" />
          {errors.order_status && <p className="text-red-500 text-sm">{(errors.order_status as any).message}</p>}
        </div>

        <div>
          <label className="block text-sm">Payment Type</label>
          <input {...register('payment_type')} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Start Date</label>
          <input type="datetime-local" {...register('start_date')} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">End Date</label>
          <input type="datetime-local" {...register('end_date')} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Driver ID (optional)</label>
          <input {...register('driverId')} className="w-full border px-2 py-1 rounded" placeholder="e.g. 1" />
        </div>

        <div>
          <label className="block text-sm">Client ID (optional)</label>
          <input {...register('clientId')} className="w-full border px-2 py-1 rounded" placeholder="e.g. 1" />
        </div>

        <div className="pt-2 flex items-center space-x-2">
          <button type="submit" disabled={update.isLoading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {update.isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}