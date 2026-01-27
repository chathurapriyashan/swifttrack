import { Edit2, Trash2, Phone, Mail, CreditCard, Car, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Driver } from '../App';

interface DriversListProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
  onToggleAvailability: (driverId: number) => void;
}

export function DriversList({ drivers, onEdit, onDelete, onToggleAvailability }: DriversListProps) {
  if (drivers.length === 0) {
    return (
      <div className="border border-gray-200 p-12 text-center">
        <p className="text-gray-400">No drivers found</p>
        <p className="text-sm text-gray-400 mt-1">Click "Add Driver" to create your first driver</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {drivers.map((driver) => (
        <div
          key={driver.id}
          className="border border-gray-300 p-6 hover:border-black transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl">{driver.name}</h3>
                <button
                  onClick={() => onToggleAvailability(driver.id)}
                  className="flex items-center gap-1 text-sm"
                  title={driver.available ? 'Mark as unavailable' : 'Mark as available'}
                >
                  {driver.available ? (
                    <>
                      <ToggleRight className="w-5 h-5" strokeWidth={1.5} />
                      <span className="text-xs uppercase tracking-wider">Available</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                      <span className="text-xs uppercase tracking-wider text-gray-400">Unavailable</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(driver)}
                className="p-2 border border-gray-300 hover:border-black transition-colors"
                title="Edit driver"
              >
                <Edit2 className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => onDelete(driver)}
                className="p-2 border border-gray-300 hover:border-red-500 hover:bg-red-50 transition-colors"
                title="Delete driver"
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              <span className="text-gray-600">Phone:</span>
              <span>{driver.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              <span className="text-gray-600">Email:</span>
              <span>{driver.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              <span className="text-gray-600">Vehicle:</span>
              <span>{driver.vehicle}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              <span className="text-gray-600">License:</span>
              <span>{driver.license}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
