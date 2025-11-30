import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '@/lib/axios'; // Використовуємо абсолютний імпорт
import { User } from '@/features/users/types'; // Описуємо тип в окремому файлі

const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get('/users');
  return response.data.data;
};

const getUserById = async (id: string): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`);
  console.log('Fetched user:', response.data);
  return response.data.data;
};

const createUser = async (newUser: Omit<User, 'id'>): Promise<User> => {
  const response = await apiClient.post('/users', newUser);
  return response.data.data;
};

const updateUser = async ({ id, data }: { id: string, data: Partial<User> }): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data.data;
};

const deleteUser = async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
};

export const useUsers = () => useQuery<User[]>({ queryKey: ['users'], queryFn: getUsers });

export const useUser = (id: string) => useQuery<User>({ queryKey: ['users', id], queryFn: () => getUserById(id) });

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            navigate({ to: '/users/list' });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateUser,
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.setQueryData(['users', updatedUser.id], updatedUser);
            navigate({ to: '/users/list' });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

