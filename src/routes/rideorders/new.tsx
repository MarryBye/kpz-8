import React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useCreateRideOrder } from '@/features/rideorders/api';

export const Route = createFileRoute('/rideorders/new')({
  component: RouteComponent,
});

type FormData = {
  order_status: string;
  payment_type: string;
  clientId: number | null;
  start_date?: string | undefined;
  end_date?: string | undefined;
  driverId?: number | undefined;
};

function RouteComponent() {
  const navigate = useNavigate();
  const create = useCreateRideOrder();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const payload: any = {
      order_status: data.order_status,
      payment_type: data.payment_type,
      clientId: data.clientId,
      start_date: data.start_date ? data.start_date : undefined,
      end_date: data.end_date ? data.end_date : undefined,
      driverId: data.driverId ? data.driverId : undefined,
    };

    create.mutate(payload as any, {
      onSuccess: () => navigate({ to: '/rideorders/list' }),
    });
  };

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-4 flex justify-between items-center">
        <Link to="/rideorders/list" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">&larr; Back to ride orders</Link>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Create Ride Order</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Status</label>
          <input {...register('order_status', { required: 'Status required' })} className="w-full border px-2 py-1 rounded" />
          {errors.order_status && <p className="text-red-500 text-sm">{errors.order_status.message}</p>}
        </div>

        <div>
          <label className="block text-sm">Payment Type</label>
          <input {...register('payment_type', { required: 'Payment type required' })} className="w-full border px-2 py-1 rounded" />
          {errors.payment_type && <p className="text-red-500 text-sm">{errors.payment_type.message}</p>}
        </div>

        <div>
          <label className="block text-sm">Start Date</label>
          <input type="datetime-local" {...register('start_date', { required: 'Start date required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">End Date</label>
          <input type="datetime-local" {...register('end_date', { required: 'End date required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Driver ID (optional)</label>
          <input {...register('driverId')} className="w-full border px-2 py-1 rounded" placeholder="e.g. 1" />
        </div>

        <div>
          <label className="block text-sm">Client ID (optional)</label>
          <input {...register('clientId')} className="w-full border px-2 py-1 rounded" placeholder="e.g. 1" />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={create.isLoading}>
          Create Ride Order
        </button>
      </form>
    </div>
  );
}