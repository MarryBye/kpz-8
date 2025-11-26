// ...existing code...
import React, { useEffect } from 'react';
import { createFileRoute, Link, useNavigate, useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useUser, useUpdateUser, useDeleteUser, UpdateUserPayload } from '@/features/users/api';

export const Route = createFileRoute('/users/update/$userId')({
  component: RouteComponent,
});

type FormData = {
  username?: string;
  name?: string;
  role?: string;
  language?: string;
  carId?: number | '';
};

function RouteComponent() {
  const navigate = useNavigate();
  const { userId } = useParams({ from: '/users/update/$userId' });
  const { data: user, isLoading, isError, error } = useUser(userId);
  const update = useUpdateUser();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: { username: '', name: '', role: '', language: '', carId: '' },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: (user.username as string) ?? null,
        name: user.name ?? null,
        role: (user.role as string) ?? null,
        language: (user.language as string) ?? null,
        carId: user.car ? user.car.id : null,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: FormData) => {
    update.mutate({ id: userId, data });
  };

  if (!userId || isNaN(userId)) return <div className="p-4">Missing or invalid user id.</div>;
  if (isLoading) return <div className="p-4">Loading user...</div>;
  if (isError) return <div className="p-4 text-red-600">Error: {(error as any)?.message ?? String(error)}</div>;
  if (!user) return <div className="p-4">User not found.</div>;

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-4">
        <div>
          <Link to={`/users/${user.id}`} className="text-indigo-600">&larr; Back to user</Link>
          <Link to="/users/list" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            List users
          </Link>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Edit User #{user.id}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Username</label>
          <input {...register('username')} className="w-full border px-2 py-1 rounded" />
          {errors.username && <p className="text-red-500 text-sm">{(errors.username as any).message}</p>}
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
          <input {...register('carId')} className="w-full border px-2 py-1 rounded" placeholder="e.g. 1" />
        </div>

        <div className="pt-2 flex items-center space-x-2">
          <button type="submit" disabled={update.isLoading} className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50">
            {update.isLoading ? 'Saving...' : 'Save'}
          </button>

          <Link to={`/users/${user.id}`} className="px-4 py-2 bg-gray-200 rounded">Cancel</Link>
        </div>
      </form>
    </div>
  );
}