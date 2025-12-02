# Лабораторно-практична робота №8

## Full-stack інтеграція: розробка UI на базі професійного бойлерплейту

Мета: Пройти повний, реалістичний цикл розробки: від проєктування інтерфейсу до його інтеграції з REST API, використовуючи професійний набір інструментів. Навчитись керувати серверним станом за допомогою TanStack Query, будувати надійні форми з React Hook Form та Zod, та організовувати навігацію за допомогою TanStack Router.

Короткий опис
- Проста CRM для таксі з базовим CRUD для сутностей: Users, Cars, RideOrders.
- Авторизація через endpoint /auth/login.
- UI: форми побудовані на React Hook Form; запити та кешування — TanStack Query.
- HTTP-клієнт — Axios з interceptor-ами для додавання токена та обробки 401.
- Роутинг — TanStack Router (генерація маршрутової карти в `src/routeTree.gen.ts`).

Швидкий старт
```sh
pnpm install
pnpm run dev   
pnpm run build 
pnpm run test   
```

Див. також package.json.

Реалізований функціонал (покликання на файли)

Сторінки та маршрути:
Список користувачів: UsersListPage — src/routes/users/list.tsx
Деталі користувача: UsersDetailPage — src/routes/users/$userId.tsx
Створення/оновлення користувача: /users/new і /users/update/$userId
Аналогічно для машин: src/routes/cars/*, src/routes/cars/$carId.tsx
Замовлення поїздок: src/routes/rideorders/*
Ключовий код — 1) Конфігурація Axios

Глобальний клієнт: apiClient — src/lib/axios.ts
Зберігання токена: useAuthStore — src/store/useAuthStore.ts

Приклад:

```ts
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

- Створені хуки для сутностей
Users: useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser — src/features/users/api.ts
Cars: useCars, useCar, useCreateCar, useUpdateCar, useDeleteCar — src/features/cars/api.ts
RideOrders: useRideOrders, useRideOrder, useCreateRideOrder, useUpdateRideOrder, useDeleteRideOrder — src/features/rideorders/api.ts

Приклад:

```ts
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
```

Коментарі щодо особливостей реалізації та відомих проблем

Axios-interceptor використовує Zustand стор для доступу до токена через useAuthStore.getState()  
При 401 відбувається очищення токена і редірект на /auth/login.
