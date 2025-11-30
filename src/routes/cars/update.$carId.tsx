// ...existing code...
import React, { useEffect } from 'react';
import { createFileRoute, Link, useNavigate, useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useCar, useUpdateCar } from '@/features/cars/api';

export const Route = createFileRoute('/cars/update/$carId')({
  component: RouteComponent,
});

type FormData = {
  mark?: string;
  model?: string;
  driverId?: number | '';
  car_class?: string;
  car_status?: string;
};

function RouteComponent() {
  const navigate = useNavigate();
  const { carId } = useParams({ from: '/cars/update/$carId' });
  const { data: car, isLoading, isError, error } = useCar(carId);
  const update = useUpdateCar();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (car) {
      reset({
        mark: car.mark ?? '',
        model: car.model ?? '',
        driverId: car.driver ? car.driver.id : '',
        car_class: car.car_class ?? '',
        car_status: car.car_status ?? '',
      });
    }
  }, [car, reset]);

  const onSubmit = (data: FormData) => {
    const payload = {
      mark: data.mark,
      model: data.model,
      driverId: data.driverId ? data.driverId : undefined,
      car_class: data.car_class ? data.car_class : undefined,
      car_status: data.car_status ? data.car_status : undefined,
    } as any;

    update.mutate({ id: carId, data: payload }, { onSuccess: () => navigate({ to: `/cars/${carId}` }) });
  };

  if (!carId || isNaN(Number(String(carId)))) return <div className="p-4">Missing or invalid car id.</div>;
  if (isLoading) return <div className="p-4">Loading car...</div>;
  if (isError) return <div className="p-4 text-red-600">Error: {(error as any)?.message ?? String(error)}</div>;
  if (!car) return <div className="p-4">Car not found.</div>;

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-4">
        <div>
          <Link to={`/cars/${car.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">&larr; Back to car</Link>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Edit Car #{car.id}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Mark</label>
          <input {...register('mark')} className="w-full border px-2 py-1 rounded" />
          {errors.mark && <p className="text-red-500 text-sm">{(errors.mark as any)?.message}</p>}
        </div>

        <div>
          <label className="block text-sm">Model</label>
          <input {...register('model')} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Car Class</label>
          <input {...register('car_class')} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Car Status</label>
          <input {...register('car_status')} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Driver ID (optional)</label>
          <input {...register('driverId', { valueAsNumber: true })} className="w-full border px-2 py-1 rounded" placeholder="e.g. 1" />
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