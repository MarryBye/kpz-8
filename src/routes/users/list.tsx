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
        <h1 className="text-2xl font-bold">Users</h1>
        <Link to="/users/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create New User
        </Link>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          {
            users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">
                  <Link to={`/users/${user.id}`} className="text-indigo-600">{user.name}</Link>
                </td>
                <td className="py-2 px-4 border-b">${user.price}</td>
                <td className="py-2 px-4 border-b text-center">
                  <Link to={`/users/update/${user.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(user.id)} disabled={deleteUserMutation.isPending} className="text-red-600 hover:text-red-900 disabled:opacity-50">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}