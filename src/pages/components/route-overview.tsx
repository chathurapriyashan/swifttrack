import { Package, CheckCircle2, Clock, TruckIcon } from 'lucide-react';

interface RouteOverviewProps {
  totalOrders: number;
  completed: number;
  pending: number;
  inProgress: number;
}

export function RouteOverview({ totalOrders, completed, pending, inProgress }: RouteOverviewProps) {
  return (
    <div className="border border-black p-4">
      <h2 className="text-sm uppercase tracking-wider mb-3">Route Summary</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-gray-300 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-wider text-gray-600">Total</span>
          </div>
          <p className="text-2xl">{totalOrders}</p>
        </div>
        
        <div className="border border-gray-300 p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-wider text-gray-600">Done</span>
          </div>
          <p className="text-2xl">{completed}</p>
        </div>
        
        <div className="border border-gray-300 p-3">
          <div className="flex items-center gap-2 mb-1">
            <TruckIcon className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-wider text-gray-600">Active</span>
          </div>
          <p className="text-2xl">{inProgress}</p>
        </div>
        
        <div className="border border-gray-300 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-wider text-gray-600">Pending</span>
          </div>
          <p className="text-2xl">{pending}</p>
        </div>
      </div>
    </div>
  );
}
