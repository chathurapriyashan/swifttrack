import { Activity } from 'lucide-react';

interface StatusUpdateProps {
  statuses: string[];
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  currentStatus: string;
}

export function StatusUpdate({ statuses, selectedStatus, onSelectStatus, currentStatus }: StatusUpdateProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4" strokeWidth={1.5} />
        <h2 className="text-sm uppercase tracking-wider text-gray-600">Update Status</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {statuses.map((status) => {
          const isSelected = status === selectedStatus;
          const isCurrent = status === currentStatus;
          
          return (
            <button
              key={status}
              type="button"
              onClick={() => onSelectStatus(status)}
              className={`relative px-4 py-3 border transition-all text-sm ${
                isSelected
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {status}
              {isCurrent && !isSelected && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-gray-400 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {selectedStatus !== currentStatus && (
        <div className="mt-3 text-sm text-gray-600">
          Status will change from <span className="font-medium">{currentStatus}</span> to{' '}
          <span className="font-medium">{selectedStatus}</span>
        </div>
      )}
    </div>
  );
}
