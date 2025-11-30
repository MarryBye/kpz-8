import { Link, createFileRoute, useParams, useNavigate } from '@tanstack/react-router';
import { useCar, useDeleteCar } from '@/features/cars/api';

export const Route = createFileRoute('/cars/$carId')({
  component: CarDetailPage,
});

function CarDetailPage() {
  const navigate = useNavigate();
  const { carId } = useParams({ from: '/cars/$carId' });
  const { data: car, isLoading, isError, error } = useCar(carId);
  const deleteCarMutation = useDeleteCar();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      deleteCarMutation.mutate(String(id));
      navigate({ to: '/cars/list' });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading car: {(error as any)?.message ?? 'Unknown error'}</div>;
  if (!car) return <div>No car found.</div>;

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
            <Link to="/cars/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Create New Car
            </Link>
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Car Info</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">
              <p><strong>ID:</strong> {car.id}</p>
              <p><strong>Mark:</strong> {car.mark}</p>
              <p><strong>Model:</strong> {car.model}</p>
              <p><strong>Class:</strong> {car.car_class}</p>
              <p><strong>Status:</strong> {car.car_status}</p>
              <p>
                <strong>Driver:</strong>{' '}
                {
                  car.driver?.id != null
                    ?
                  <Link to={`/users/${car.driver.id}`} className="text-blue-500 hover:underline">
                    {car.driver.name ?? 'No driver'}
                  </Link>
                    :
                  'No driver'
                }
              </p>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/cars/update/${car?.id}`}
                  className="cursor-pointer text-white font-bold w-full py-2 text-center bg-yellow-500 rounded"
                >
                  Update
                </Link>
                <Link
                  onClick={() => handleDelete(Number(car?.id))}
                  className="cursor-pointer text-white font-bold w-full py-2 text-center bg-red-500 rounded"
                >
                  Delete
                </Link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}