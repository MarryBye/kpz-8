import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: string;
}

const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload);
  return response.data;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const token = data.data.split(' ')[1];
      setToken(token);
      navigate({ to: '/users/list' });
    }
  });
};