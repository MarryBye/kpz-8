// ...existing code...
import React, { useEffect } from 'react';
import { createFileRoute, Link, useNavigate, useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useUser, useUpdateUser, useDeleteUser, UpdateUserPayload } from '@/features/users/api';

export const Route = createFileRoute('/users/update/$userId')({
  component: RouteComponent,
});

type FormData = {
  username: string;
  name: string;
};

function RouteComponent() {
  const navigate = useNavigate();
  const { userId } = useParams({ from: '/users/update/$userId' });
  const { data: user } = useUser(userId);
  const update = useUpdateUser();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (user) {
      reset({
        username: (user.username as string) ?? null,
        name: user.name ?? null
      });
    }
  }, [user, reset]);

  const onSubmit = (data: FormData) => {
    update.mutate({ id: userId, data });
  };

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-4 flex justify-between items-center">
        <Link to="/users/list" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">&larr; Back to users</Link>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Update User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        <div>
          <label className="block text-sm">Username</label>
          <input {...register('username', { required: 'Username required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Name</label>
          <input {...register('name', { required: 'Name required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={update.isLoading}>
          Update User
        </button>
      </form>
    </div>
  );
}