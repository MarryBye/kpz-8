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
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 420, margin: 20 }}>
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register('email', { required: 'Email required' })}
        />
        {formState.errors.email && <div style={{ color: 'red' }}>{formState.errors.email.message}</div>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: 'Password required' })}
        />
        {formState.errors.password && <div style={{ color: 'red' }}>{formState.errors.password.message}</div>}
      </div>

      <button type="submit" disabled={loginMutation.isLoading}>
        {loginMutation.isLoading ? 'Logging in...' : 'Login'}
      </button>

      {loginMutation.isError && (
        <div style={{ color: 'red', marginTop: 8 }}>
          {(loginMutation.error as Error)?.message ?? 'Login failed'}
        </div>
      )}
    </form>
  );
}