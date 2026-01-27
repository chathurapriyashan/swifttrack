import { AlertCircle } from 'lucide-react';
import type { Driver } from '../App';

interface UpdateSummaryProps {
  currentDriver: Driver;
  newDriver: Driver;
  currentStatus: string;
  newStatus: string;
}

export function UpdateSummary({ currentDriver, newDriver, currentStatus, newStatus }: UpdateSummaryProps) {
  const driverChanged = currentDriver.id !== newDriver.id;
  const statusChanged = currentStatus !== newStatus;

  if (!driverChanged && !statusChanged) {
    return null;
  }

  return (
    <div className="border border-gray-300 bg-gray-50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
        <h2 className="text-sm uppercase tracking-wider text-gray-600">Changes Summary</h2>
      </div>

      <div className="space-y-3 text-sm">
        {driverChanged && (
          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-gray-600">Driver:</span>
            <span className="text-gray-500 line-through">{currentDriver.name}</span>
            <span className="font-medium">{newDriver.name}</span>
          </div>
        )}

        {statusChanged && (
          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-gray-600">Status:</span>
            <span className="text-gray-500 line-through">{currentStatus}</span>
            <span className="font-medium">{newStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
}
