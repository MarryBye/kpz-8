import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/features/auth/api';

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
});

type FormData = {
  email: string;
  password: string;
};

function RouteComponent() {
  const { register, handleSubmit, formState } = useForm<FormData>();
  const loginMutation = useLogin();

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm">Email</label>
          <input
            className="w-full border px-2 py-1 rounded"
            type="email"
            {...register('email', { required: 'Email required' })}
          />
          {formState.errors.email && <div style={{ color: 'red' }}>{formState.errors.email.message}</div>}
        </div>

        <div>
          <label className="block text-sm">Password</label>
          <input
            type="password"
            className="w-full border px-2 py-1 rounded"
            {...register('password', { required: 'Password required' })}
          />
          {formState.errors.password && <div style={{ color: 'red' }}>{formState.errors.password.message}</div>}
        </div>

        <button type="submit" disabled={loginMutation.isLoading} className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-1'>
          {loginMutation.isLoading ? 'Logging in...' : 'Login'}
        </button>

        {loginMutation.isError && (
          <div style={{ color: 'red', marginTop: 8 }}>
            {(loginMutation.error as Error)?.message ?? 'Login failed'}
          </div>
        )}
      </form>
    </div>
  );
}