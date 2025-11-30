// ...existing code...
import React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useCreateCar } from '@/features/cars/api';

export const Route = createFileRoute('/cars/new')({
  component: RouteComponent,
});

type FormData = {
  mark: string;
  model: string;
  driverId?: string;
  car_class: string;
  car_status: string;
};

function RouteComponent() {
  const navigate = useNavigate();
  const create = useCreateCar();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const payload: any = {
      mark: data.mark,
      model: data.model,
      driverId: data.driverId ? data.driverId : undefined,
      car_class: data.car_class,
      car_status: data.car_status,
    };

    create.mutate(payload as any, {
      onSuccess: () => navigate({ to: '/cars/list' }),
    });
  };

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-4 flex justify-between items-center">
        <Link to="/cars/list" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">&larr; Back to cars</Link>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Create Car</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Mark</label>
          <input {...register('mark', { required: 'Mark required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Model</label>
          <input {...register('model', { required: 'Model required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Car class</label>
          <input {...register('car_class', { required: 'Class required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Car status</label>
          <input {...register('car_status', { required: 'Status required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Driver ID (optional)</label>
          <input {...register('driverId')} className="w-full border px-2 py-1 rounded" placeholder="e.g. 1" />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={create.isLoading}>
          Create Car
        </button>
      </form>
    </div>
  );
}