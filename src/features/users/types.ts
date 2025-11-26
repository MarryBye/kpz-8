export type User = {
    id: number;
    email: string;
    name: string;
    language: string;
    role: string;
    username: string;
    car?: {
        id: number;
        mark: string;
        model: string;
    }
}

export type RideOrder = {
    id: number;
    order_status: string;
    payment_type: string;
    start_date: string;
    end_date: string; 
    driver: User;
    client: User;
}

export type Car = {
    id: number;
    mark: string;
    model: string;
    driver?: User;
}