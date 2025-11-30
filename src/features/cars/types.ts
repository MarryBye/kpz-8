import type { User } from '@/features/users/types';

export type Car = {
    id: number;
    mark: string;
    model: string;
    car_class: string;
    car_status: string;
    driver?: User;
}