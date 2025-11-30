import type { User } from '@/features/users/types';

export type RideOrder = {
    id: number;
    order_status: string;
    payment_type: string;
    start_date: string;
    end_date: string; 
    driver: User;
    client: User;
}