import { Link, createFileRoute, useParams, useNavigate } from '@tanstack/react-router';
import { useUsers, useDeleteUser } from '@/features/users/api';

export const Route = createFileRoute('/users/list')({
  component: UsersListPage,
});

function UsersListPage() {
  const navigate = useNavigate();

  const { data: users, isLoading, isError, error } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(id);
      navigate({ to: '/users/list' });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading users: {error.message}</div>;

  return (
    <div className="p-4">
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex row gap-2 items-center">
            <h1 className="text-2xl font-bold">TaxiCRM</h1>
            <Link to="/users/list" className="text-blue-500 hover:underline">
            Users
            </Link>
            <Link to="/cars/list" className="text-blue-500 hover:underline">
            Cars
            </Link>
            <Link to="/rideorders/list" className="text-blue-500 hover:underline">
            Orders
            </Link>
        </div>
        <div className="buttons-group">
            <Link to="/users/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Create New User
            </Link>
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">E-Mail</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Language</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Car link</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          {
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.language}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  {user.car ? (
                    <Link to={`/cars/${user.car.id}`} className="text-blue-500 hover:underline">
                      {user.car.mark} {user.car.model}
                    </Link>
                  ) : (
                    'No Car'
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`/users/update/${user.id}`}
                    className="cursor-pointer text-yellow-500 px-2 py-1"
                  >
                    Edit
                  </Link>
                  <Link
                    onClick={() => handleDelete(String(user.id))}
                    className="cursor-pointer text-red-500 px-2 py-1"
                  >
                    Delete
                  </Link>
                  <Link
                    to={`/users/${user.id}`}
                    className="cursor-pointer text-blue-500 px-2 py-1"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}