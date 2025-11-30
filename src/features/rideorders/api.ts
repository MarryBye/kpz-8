import { RideOrder } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '@/lib/axios'; // Використовуємо абсолютний імпорт
import { RideOrder } from '@/features/rideorders/types'; // Описуємо тип в окремому файлі

const getRideOrders = async (): Promise<RideOrder[]> => {
  const response = await apiClient.get('/rideorders');
  return response.data.data;
};

const getRideOrderById = async (id: string): Promise<RideOrder> => {
  const response = await apiClient.get(`/rideorders/${id}`);
  return response.data.data;
};

const createRideOrder = async (newRideOrder: Omit<RideOrder, 'id'>): Promise<RideOrder> => {
  const response = await apiClient.post('/rideorders', newRideOrder);
  return response.data.data;
};

const updateRideOrder = async ({ id, data }: { id: string, data: Partial<RideOrder> }): Promise<RideOrder> => {
    const response = await apiClient.patch(`/rideorders/${id}`, data);
    return response.data.data;
};

const deleteRideOrder = async (id: string): Promise<void> => {
    await apiClient.delete(`/rideorders/${id}`);
};

export const useRideOrders = () => useQuery<RideOrder[]>({ queryKey: ['rideorders'], queryFn: getRideOrders });

export const useRideOrder = (id: string) => useQuery<RideOrder>({ queryKey: ['rideorders', id], queryFn: () => getRideOrderById(id) });

export const useCreateRideOrder = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createRideOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rideorders'] });
            navigate({ to: '/rideorders/list' });
        },
    });
};

export const useUpdateRideOrder = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateRideOrder,
        onSuccess: (updatedRideOrder) => {
            queryClient.invalidateQueries({ queryKey: ['rideorders'] });
            queryClient.setQueryData(['rideorders', updatedRideOrder.id], updatedRideOrder);
            navigate({ to: '/rideorders/list' });
        },
    });
};

export const useDeleteRideOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRideOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rideorders'] });
        },
    });
};

