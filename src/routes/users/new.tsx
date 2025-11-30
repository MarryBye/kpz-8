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
  username: string;
  name: string;
  role: string;
  language: string;
};

function RouteComponent() {
  const navigate = useNavigate();
  const create = useCreateUser();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const payload = { ...data };
    create.mutate(payload as any, {
      onSuccess: () => navigate({ to: '/users/list' }),
    });
  };

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-4 flex justify-between items-center">
        <Link to="/users/list" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">&larr; Back to users</Link>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Create User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        <div>
          <label className="block text-sm">E-Mail</label>
          <input {...register('email', { required: 'Email required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Password</label>
          <input type="password" {...register('password', { required: 'Password required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Username</label>
          <input {...register('username', { required: 'Username required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Name</label>
          <input {...register('name', { required: 'Name required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Role</label>
          <input {...register('role', { required: 'Role required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm">Language</label>
          <input {...register('language', { required: 'Language required' })} className="w-full border px-2 py-1 rounded" />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={create.isLoading}>
          Create User
        </button>
      </form>
    </div>
  );
}