import { Link, createFileRoute, useParams, useNavigate } from '@tanstack/react-router';
import { useCars, useDeleteCar } from '@/features/cars/api';

export const Route = createFileRoute('/cars/list')({
  component: CarsListPage,
});

function CarsListPage() {
  const navigate = useNavigate();
  const { data: cars, isLoading, isError, error } = useCars();
  const deleteCarMutation = useDeleteCar();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      deleteCarMutation.mutate(id);
      navigate({ to: '/cars/list' });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading cars: {(error as any)?.message ?? String(error)}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex row gap-2 items-center">
          <h1 className="text-2xl font-bold">TaxiCRM</h1>
          <Link to="/users/list" className="text-blue-500 hover:underline">Users</Link>
          <Link to="/cars/list" className="text-blue-500 hover:underline">Cars</Link>
          <Link to="/rideorders/list" className="text-blue-500 hover:underline">Orders</Link>
        </div>
        <div className="buttons-group">
          <Link to="/cars/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create New Car
          </Link>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Cars</h1>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Mark</th>
            <th className="py-2 px-4 border-b">Model</th>
            <th className="py-2 px-4 border-b">Class</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Driver</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          {cars?.map((car) => (
            <tr key={car.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{car.id}</td>
              <td className="py-2 px-4 border-b">{car.mark}</td>
              <td className="py-2 px-4 border-b">{car.model}</td>
              <td className="py-2 px-4 border-b">{car.car_class}</td>
              <td className="py-2 px-4 border-b">{car.car_status}</td>
              <td className="py-2 px-4 border-b">
                {car.driver ? (
                  <Link to={`/users/${car.driver.id}`} className="text-blue-500 hover:underline">
                    {car.driver.name}
                  </Link>
                ) : (
                  'No Driver'
                )}
              </td>
              <td className="py-2 px-4 border-b">
                <Link 
                  to={`/cars/update/${car.id}`} 
                  className="cursor-pointer text-yellow-500 px-2 py-1"
                >
                  Edit
                </Link>
                <Link 
                  onClick={() => handleDelete(car.id)} 
                  disabled={(deleteCarMutation as any).isPending} 
                  className="cursor-pointer text-red-500 px-2 py-1"
                >
                  Delete
                </Link>
                <Link 
                  to={`/cars/${car.id}`} 
                  className="cursor-pointer text-blue-500 px-2 py-1"
                >
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}