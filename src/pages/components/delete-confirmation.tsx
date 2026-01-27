import { AlertTriangle } from 'lucide-react';
import type { Driver } from '../App';

interface DeleteConfirmationProps {
  driver: Driver;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmation({ driver, onConfirm, onCancel }: DeleteConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white max-w-md w-full border border-black">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6" strokeWidth={1.5} />
            <h2 className="text-xl tracking-tight">Delete Driver</h2>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-medium text-black">{driver.name}</span>? 
            This action cannot be undone.
          </p>

          <div className="bg-gray-50 border border-gray-200 p-4 mb-6 text-sm">
            <div className="space-y-1">
              <p><span className="text-gray-600">Phone:</span> {driver.phone}</p>
              <p><span className="text-gray-600">Email:</span> {driver.email}</p>
              <p><span className="text-gray-600">Vehicle:</span> {driver.vehicle}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-black text-white py-3 uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={onCancel}
              className="flex-1 border border-gray-300 py-3 uppercase tracking-wider hover:border-black transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
