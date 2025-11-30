import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '@/lib/axios'; // Використовуємо абсолютний імпорт
import { Car } from '@/features/cars/types'; // Описуємо тип в окремому файлі

const getCars = async (): Promise<Car[]> => {
  const response = await apiClient.get('/cars');
  return response.data.data;
};

const getCarById = async (id: string): Promise<Car> => {
  const response = await apiClient.get(`/cars/${id}`);
  return response.data.data;
};

const createCar = async (newCar: Omit<Car, 'id'>): Promise<Car> => {
  const response = await apiClient.post('/cars', newCar);
  return response.data.data;
};

const updateCar = async ({ id, data }: { id: string, data: Partial<Car> }): Promise<Car> => {
    const response = await apiClient.patch(`/cars/${id}`, data);
    return response.data.data;
};

const deleteCar = async (id: string): Promise<void> => {
    await apiClient.delete(`/cars/${id}`);
};

export const useCars = () => useQuery<Car[]>({ queryKey: ['cars'], queryFn: getCars });

export const useCar = (id: string) => useQuery<Car>({ queryKey: ['cars', id], queryFn: () => getCarById(id) });

export const useCreateCar = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createCar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            navigate({ to: '/cars/list' });
        },
    });
};

export const useUpdateCar = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateCar,
        onSuccess: (updatedCar) => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            queryClient.setQueryData(['cars', updatedCar.id], updatedCar);
            navigate({ to: '/cars/list' });
        },
    });
};

export const useDeleteCar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
        },
    });
};

