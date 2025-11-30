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