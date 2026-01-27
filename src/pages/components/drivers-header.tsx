import { Users, Plus } from 'lucide-react';

interface DriversHeaderProps {
  onCreateDriver: () => void;
  totalDrivers: number;
  availableDrivers: number;
}

export function DriversHeader({ onCreateDriver, totalDrivers, availableDrivers }: DriversHeaderProps) {
  return (
    <div className="border-b border-black pb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <a href="/warehouse" className='bg-black p-2 rounded-full text-white' >&larr; back</a>
          <Users className="w-8 h-8" strokeWidth={1.5} />
          <h1 className="text-4xl tracking-tight">Manage Drivers</h1>
        </div>
        <button
          onClick={onCreateDriver}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Add Driver
        </button>
      </div>
      <div className="flex gap-8 text-sm">
        <div>
          <span className="text-gray-600">Total Drivers:</span>
          <span className="ml-2 font-medium">{totalDrivers}</span>
        </div>
        <div>
          <span className="text-gray-600">Available:</span>
          <span className="ml-2 font-medium">{availableDrivers}</span>
        </div>
        <div>
          <span className="text-gray-600">Unavailable:</span>
          <span className="ml-2 font-medium">{totalDrivers - availableDrivers}</span>
        </div>
      </div>
    </div>
  );
}
