// ...existing code...
import React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useCreateUser } from '@/features/users/api';

export const Route = createFileRoute('/users/new')({
  component: RouteComponent,
});

type FormData = {
  email: string;
  password: string;
  username?: string;
  name?: string;
  role?: string;
  language?: string;
  carId?: number | '';
};

function RouteComponent() {
  const navigate = useNavigate();
  const create = useCreateUser();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { email: '', password: '', username: '', name: '', role: '', language: '', carId: '' },
  });

  const onSubmit = (data: FormData) => {
    const payload = { ...data, carId: data.carId === '' ? undefined : data.carId };
    create.mutate(payload as any, {
      onSuccess: () => navigate({ to: '/users/list' }),
    });
  };

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-4">
        <div>
          <Link to="/users/list" className="text-indigo-600">&larr; Back to users</Link>
          <Link to="/users/list" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            List users
          </Link>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Create User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input {...register('email', { required: 'Email required' })} className="w-full border px-2 py-1 rounded" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm">Password</label>
          <input {...register('password', { required: 'Password required' })} type="password" className="w-full border px-2 py-1 rounded" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm">Username</label>
          <input {...register('username')} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Name</label>
          <input {...register('name')} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Role</label>
          <input {...register('role')} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Language</label>
          <input {...register('language')} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Car ID (optional)</label>
          <input {...register('carId', { valueAsNumber: true })} className="w-full border px-2 py-1 rounded" placeholder="e.g. 1" />
        </div>

        <div className="pt-2 flex items-center space-x-2">
          <button type="submit" disabled={create.isLoading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
            {create.isLoading ? 'Creating...' : 'Create'}
          </button>
          <Link to="/users/list" className="px-4 py-2 bg-gray-200 rounded">Cancel</Link>
        </div>

        {create.isError && (
          <div className="text-red-600 mt-2">
            {(create.error as any)?.response?.data?.message ?? (create.error as any)?.message ?? 'Error creating user'}
          </div>
        )}
      </form>
    </div>
  );
}