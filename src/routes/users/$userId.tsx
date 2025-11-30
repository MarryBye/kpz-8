import { Link, createFileRoute, useParams, useNavigate } from '@tanstack/react-router';
import { useUser, useDeleteUser } from '@/features/users/api';

export const Route = createFileRoute('/users/$userId')({
  component: UsersDetailPage,
});

function UsersDetailPage() {
  const navigate = useNavigate(); 
  const { userId } = useParams({ from: '/users/$userId' });
  const { data: user, isLoading, isError, error } = useUser(userId);
  const deleteUserMutation = useDeleteUser(userId);
  
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
            <th className="py-2 px-4 border-b">User Info</th>
          </tr>
        </thead>
        {
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">
                <p><strong>ID:</strong> {user?.id}</p>
                <p><strong>E-Mail:</strong> {user?.email}</p>
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Language:</strong> {user?.language}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                <p>
                  <strong>Car link: </strong> 
                  {
                    user?.car?.id != undefined ?
                      <Link 
                        to={`/cars/${user?.car?.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {user?.car ? user.car.mark + ' ' + user.car.model : 'No car assigned'}
                      </Link>
                    : 'No car assigned'
                  }
                </p>
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/users/update/${user?.id}`}
                    className="cursor-pointer text-white font-bold w-full py-2 text-center bg-yellow-500 rounded"
                  >
                    Update
                  </Link>
                  <Link
                    onClick={() => handleDelete(String(user?.id))}
                    className="cursor-pointer text-white font-bold w-full py-2 text-center bg-red-500 rounded"
                  >
                    Delete
                  </Link>
                </div>
              </td>
            </tr>
          </tbody>
        }
      </table>
    </div>
  );
}